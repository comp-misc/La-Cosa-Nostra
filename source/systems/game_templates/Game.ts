/*
By the time this instance
is initialised, the roles should
already be defined
*/

import {
	Client,
	Guild,
	GuildMember,
	Message,
	MessageReaction,
	PresenceData,
	ReactionCollector,
	Role,
	Snowflake,
	TextChannel,
	User,
} from "discord.js"
import filterDefined from "../../auxils/filterDefined"
import formatEmoji from "../../auxils/formatEmoji"
import getUniqueArray, { getUniqueBy } from "../../auxils/getUniqueArray"
import expansions from "../../expansions"
import getGuild from "../../getGuild"
import getLogger from "../../getLogger"
import { GameConfig, LcnConfig, PermissionsConfig } from "../../LcnConfig"
import alphabets from "../alpha_table"
import auxils from "../auxils"
import executable from "../executable"
import { RolePermission } from "../executable/misc/createPrivateChannel"
import flavours, { FlavourData } from "../flavours"
import Actions, { Actionable, ActionOptions, ExecutionParams, Trigger } from "./Actions"
import Logger from "./Logger"
import Player, { FFStatus, PlayerIdentifier } from "./Player"
import saveGame from "./saveGame"
import Timer from "./Timer"

interface ChannelMeta {
	id: Snowflake
	name: string
	created_at: Date
}
interface IntroMessage {
	channel_id: Snowflake
	message: string
}
export enum GameState {
	PRE_GAME = "pre-game",
	PLAYING = "playing",
	ENDED = "ended",
}

export type OperationType = "addition" | "subtraction" | "multiplication" | "division" | "modulo" | "max" | "min"
export interface TrialVoteOperation {
	operation: OperationType
	amount: number
}

export interface TrialVote {
	messages: string[]
	channel: Snowflake
}
export interface SpecialVoteType {
	identifier: string
	name: string
	emote: string
	singular: boolean
	voters: VoteMeta[]
}
export interface PeriodLogPin {
	message: Snowflake
	channel: Snowflake
	pin_time: Date
}
export interface DeathBroadcast {
	playerId: string
	reason: string
	position_offset: number
	circumstances: KillCircumstances
}
export interface DeathMessage {
	role: string
	reason: string
}
export interface KillCircumstances {
	attacker?: PlayerIdentifier
	target?: PlayerIdentifier
	strength?: number
	priority?: number
	type?: string
}
export interface SummaryEntry {
	message: string
	time: Date
}
export interface MessageEntry {
	message: string
	recipient: string
	time: Date
}
export interface VoteMeta {
	identifier: string
	magnitude: number
}
export interface PeriodLogEntry {
	trials: number
	period: number
	death_messages: DeathMessage[]
	trial_vote: TrialVote | null
	special_vote_types: SpecialVoteType[]
	pins: PeriodLogPin[]
	death_broadcasts: DeathBroadcast[]
	summary: SummaryEntry[]
	messages: MessageEntry[]
	no_lynch_vote: VoteMeta[]
}

export type VoteTarget = "nl" | Player
type PlayerPredicate = (player: Player) => boolean

export interface WinLog {
	faction: string
	caption: string
}

class Game {
	client: Client
	init_time: Date
	config: LcnConfig
	players: Player[] = []
	voting_halted = false
	game_start_message_sent = false
	timezone: number
	start_time: Date | undefined
	current_time: Date | undefined
	next_action: Date | undefined
	actions: Actions
	channels: Record<string, ChannelMeta> = {}
	intro_messages: IntroMessage[] = []
	period: number
	steps = 0
	state: GameState = GameState.PRE_GAME
	game_config_override: Record<string, unknown> = {}
	flavour_identifier: string | null
	timer: Timer | undefined
	timer_identifier: string | undefined
	trial_vote_operations: TrialVoteOperation[] = []
	private period_log: Record<string, PeriodLogEntry> = {}
	private win_log: WinLog | undefined
	private trial_collectors: ReactionCollector[] = []
	tampered_load_times?: Date[]

	private fastForwarded = false

	constructor(client: Client, config: LcnConfig) {
		this.client = client
		this.config = config

		this.init_time = new Date()
		this.actions = new Actions(this)
		this.period = this.config.game["day-zero"] ? 0 : 1
		this.flavour_identifier = this.config.playing.flavour

		// Timezone is GMT relative
		this.timezone = this.config.time.timezone
		this.primeDesignatedTime()
	}

	setPlayers(players: Player[]): void {
		this.players = players
	}

	primeDesignatedTime(change_start = true): void {
		// Always start day zero at closest 12pm/am
		const current = new Date()

		const now = new Date()

		current.setUTCHours(-this.timezone, 0, 0, 0)

		while (current.getTime() - now.getTime() < 0) {
			current.setUTCHours(current.getUTCHours() + 24)
		}

		if (change_start) {
			this.start_time = current
		}

		this.current_time = current

		this.next_action = new Date(current)
	}

	setChannel(name: string, channel: TextChannel): void {
		// This.channels stores SPECIAL channels,
		// not the private ones
		// not the logging ones either

		this.channels[name] = {
			id: channel.id,
			name: channel.name,
			created_at: channel.createdAt,
		}
	}

	getChannel(name: string): TextChannel {
		return this.findTextChannel(name)
	}

	findTextChannel(name: string | Snowflake): TextChannel {
		const channels = this.getGuild().channels
		const channel =
			channels.cache.find((channel) => channel.id === name) ||
			channels.cache.find((channel) => channel.name === name)
		if (!channel) {
			throw new Error(`Unknown channel ${name}`)
		}
		if (!(channel instanceof TextChannel)) {
			throw new Error(`Invalid text channel ${name}`)
		}
		return channel
	}

	getChannelById(id: Snowflake): TextChannel | null {
		const channel = this.getGuild().channels.cache.get(id)
		if (!channel) {
			return null
		}
		if (!(channel instanceof TextChannel)) {
			this.logger.logError(`Invalid text channel id ${id}`)
			return null
		}
		return channel
	}

	getPlayerById(id: string): Player | null {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].id === id) {
				return this.players[i]
			}
		}
		return null
	}

	getPlayerByIdentifier(identifier: string): Player | null {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].identifier === identifier) {
				return this.players[i]
			}
		}
		return null
	}

	getPlayerByIdentifierOrThrow(identifier: string): Player {
		const player = this.getPlayerByIdentifier(identifier)
		if (!player) {
			throw new Error(`Failed to find player with identifier '${identifier}'`)
		}
		return player
	}

	getPlayer(argument: string | Player): Player | null {
		// Flexible

		//Shouldn't pass a player, but this check was included anyway
		if (argument instanceof Player) {
			return argument
		}

		const id = this.getPlayerById(argument)
		const identifier = this.getPlayerByIdentifier(argument)

		return id || identifier
	}

	getPlayerOrThrow(argument: string): Player {
		const player = this.getPlayer(argument)
		if (!player) {
			throw new Error(`Failed to find player '${argument}'`)
		}
		return player
	}

	getPlayerByAlphabet(alphabet: string): Player | null {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].alphabet === alphabet.toUpperCase()) {
				return this.players[i]
			}
		}
		return null
	}

	getAlive(): number {
		return this.players.filter((p) => p.status.alive).length
	}

	getAlivePlayers(): Player[] {
		return this.players.filter((player) => player.status.alive)
	}

	async createTrialVote(load_preemptive = true): Promise<void> {
		const messages = await executable.misc.createTrialVote(this)

		if (this.getPeriod() != 1 && messages && messages.length) {
			const period_log = this.getPeriodLog()

			period_log.trial_vote = {
				messages: [],
				channel: messages[0].channel.id,
			}

			for (let i = 0; i < messages.length; i++) {
				period_log.trial_vote.messages.push(messages[i].id)
			}

			await this.save()

			await this.instantiateTrialVoteCollector()

			if (load_preemptive) {
				await this.loadPreemptiveVotes()
			}

			await this.reloadTrialVoteMessage()
		}
	}

	async instantiateTrialVoteCollector(): Promise<void> {
		const period_log = this.getPeriodLog()

		if (!period_log || !period_log.trial_vote) {
			return
		}

		const channel = this.findTextChannel(period_log.trial_vote.channel)

		this.trial_collectors = []

		const messages: Message[] = await Promise.all(
			period_log.trial_vote.messages.map((messageId: string) => channel.messages.fetch(messageId))
		)
		messages.forEach((message) => {
			const collector = message.createReactionCollector(() => true)
			this.trial_collectors.push(collector)
			collector.on("collect", (reaction) => {
				reaction.users.cache.forEach((user) => {
					this.receivedTrialVote(reaction, user).catch((e) => this.logger.logError(e))
				})
			})
		})
	}

	clearTrialVoteCollectors(): void {
		// Remove promises to free up memory
		this.trial_collectors.forEach((collector) => collector.stop("Autocleared"))
		this.trial_collectors = []
	}

	async clearTrialVoteReactions(remove_extra = true): Promise<void> {
		const period_log = this.getPeriodLog()

		if (period_log.trial_vote === null) {
			return
		}

		const channel_id = period_log.trial_vote.channel
		const messages_id = period_log.trial_vote.messages

		for (let i = 0; i < messages_id.length; i++) {
			if (i < 1 || !remove_extra) {
				await executable.misc.clearReactions(this, channel_id, messages_id[i])
			}

			if (i > 0 && remove_extra) {
				await executable.misc.deleteMessage(this, channel_id, messages_id[i])
			}
		}

		this.clearTrialVoteCollectors()
	}

	private async receivedTrialVote(reaction: MessageReaction, user: User): Promise<void> {
		if (user.bot) {
			return
		}

		await reaction.users.remove(user)

		if (!this.isAlive(user.id)) {
			this.logger.log(
				3,
				user.id + " tried to vote on the trial although they are either dead or not in the game!"
			)
			await user.send(
				":x: You are not alive and in the game, please do not vote in the trials! If you try that again, I will have you kicked."
			)
			return
		}

		const reversed = auxils.flipObject(alphabets)
		const emote = reaction.emoji

		const alphabet = reversed[emote.identifier]

		// Count the vote
		const voter = this.getPlayerById(user.id)
		if (!voter) {
			this.logger.logError(new Error(`Unable to find player with id ${user.id} to vote, this is probably a bug`))
			return
		}

		// Cycle through special vote types
		const special_vote_types = this.getPeriodLog().special_vote_types
		for (let i = 0; i < special_vote_types.length; i++) {
			const vote_type = special_vote_types[i]

			if (emote.name === vote_type.emote) {
				const player = this.getPlayerByIdentifier(vote_type.identifier)
				if (player) {
					await this.toggleVote(voter, player, true)
				} else {
					this.logger.logError(new Error(`No player found with identifier ${vote_type.identifier}`))
				}
				return
			}
		}

		if (alphabet === undefined) {
			return
		}

		let voted_against: VoteTarget
		if (alphabet === "nl") {
			if (!this.config.game.lynch["no-lynch-option"]) {
				this.logger.log(
					3,
					user.id + " tried voting no-lynch using the reaction poll but no-lynches are disabled!"
				)
				await user.send(":x: The no-lynch vote is disabled.")
				return
			}

			voted_against = "nl"
		} else {
			const player = this.getPlayerByAlphabet(alphabet)

			if (player === null) {
				return
			}
			voted_against = player

			// Bug check
			if (!voted_against.status.alive) {
				this.logger.log(3, "Dead player voted on!")
				await user.send(":x: You voted on a dead player! Sorry man, but the dude is already dead!")
				return
			}
		}

		await this.toggleVote(voter, voted_against)
	}

	async toggleVote(voter: Player, voted_against: VoteTarget, special_vote = false): Promise<boolean | null> {
		// Post corresponding messages

		if (this.voting_halted) {
			return null
		}

		if (voter.getStatus("voteBlocked")) {
			return null
		}

		const no_lynch_vote = voted_against === "nl" && !special_vote
		const voted_no_lynch = this.isVotingNoLynch(voter.identifier)

		// Check for (a) singular (b) total lynch counts
		const special_vote_types = this.getPeriodLog().special_vote_types
		const special_votes_from = special_vote_types.filter((x) =>
			x.voters.some((y) => y.identifier === voter.identifier)
		)
		const voted_singular = special_votes_from.some((x) => x.singular)

		const magnitude = voter.getVoteMagnitude()

		if (no_lynch_vote) {
			if (voted_singular) {
				return false
			}

			// NL vote is independent
			const has_voted = this.votesFrom(voter.identifier).length + special_votes_from.length > 0

			if (has_voted) {
				return false
			}

			const before_votes = this.getNoLynchVoteCount()

			// Count NL vote
			if (voted_no_lynch) {
				// Remove no-lynch vote
				await this.clearNoLynchVotesBy(voter.identifier)
				await executable.misc.removedNolynch(this, voter)
			} else {
				await this.addNoLynchVote(voter.identifier, magnitude)
				await executable.misc.addedNolynch(this, voter)
			}

			const after_votes = this.getNoLynchVoteCount()

			await this.checkLynchAnnouncement("nl", before_votes, after_votes)
		} else if (!special_vote) {
			if (voted_no_lynch || voted_against === "nl") {
				return false
			}

			if (voted_singular) {
				return false
			}

			if (voted_against.getStatus("lynchProof")) {
				return false
			}

			const already_voting = voted_against.isVotedAgainstBy(voter.identifier)

			if (
				!already_voting &&
				this.votesFrom(voter.identifier).length + special_votes_from.length >= this.getLynchesAvailable()
			) {
				// New vote, check if exceeds limit
				return false
			}

			const before_votes = voted_against.countVotes()

			const toggle_on = await voted_against.toggleVotes(voter.identifier, magnitude)

			const after_votes = voted_against.countVotes()

			if (toggle_on) {
				// New vote
				// OLD SYSTEM: uses IDs directly
				await executable.misc.addedLynch(this, voter, voted_against)
			} else {
				await executable.misc.removedLynch(this, voter, voted_against)
			}

			await this.checkLynchAnnouncement(voted_against.identifier, before_votes, after_votes)
		} else {
			// Special vote

			const special_vote = special_vote_types.find((x) => x.identifier === voted_against)

			if (voted_no_lynch) {
				return false
			}
			if (!special_vote) {
				this.logger.logError(new Error("No special vote found"))
				return false
			}

			// Check already voting
			const already_voting = special_vote.voters.some((x) => x.identifier === voter.identifier)

			if (
				!already_voting &&
				(this.votesFrom(voter.identifier).length + special_votes_from.length >= this.getLynchesAvailable() ||
					voted_singular)
			) {
				// New vote, check if exceeds limit
				return false
			}

			// Toggle votes
			if (already_voting) {
				// Remove special vote
				special_vote.voters = special_vote.voters.filter((x) => x.identifier !== voter.identifier)
				//TODO What is "voted_against" here? nl?

				console.log(voted_against)
				await this.execute("unvote", {
					target: "s/" + voted_against,
					voter: voter.identifier,
				})
			} else {
				special_vote.voters.push({
					identifier: voter.identifier,
					magnitude: magnitude,
				})
				//TODO What is "voted_against" here? nl?

				console.log(voted_against)
				await this.execute("vote", {
					target: "s/" + voted_against,
					voter: voter.identifier,
				})
			}
		}

		await this.reloadTrialVoteMessage()

		// Save file
		await this.save()

		if (this.hammerActive() && !this.voting_halted) {
			await this.checkLynchHammer()
		}

		return true
	}

	addSpecialVoteType(identifier: string, name: string, emote: string, singular: boolean): void {
		// {reaction, name, singular}
		const period_log = this.getPeriodLog()
		period_log.special_vote_types.push({
			identifier: identifier,
			name: name,
			emote: emote,
			singular: singular,
			voters: [],
		})
	}

	//TODO - Why are these two functions the same?
	getVotesBy(identifier: string): Player[] {
		return this.players.filter((player) => player.isVotedAgainstBy(identifier))
	}

	votesFrom(identifier: string): Player[] {
		return this.players.filter((player) => player.isVotedAgainstBy(identifier))
	}

	private async checkLynchAnnouncement(identifier: string, before: number, after: number): Promise<void> {
		const role = this.getPlayerByIdentifier(identifier)
		if (!role) {
			return
		}

		let required: number
		if (identifier === "nl") {
			required = this.getNoLynchVotesRequired()
		} else {
			required = this.getVotesRequired() - role.getVoteOffset()
		}

		// !this.config["game"]["lynch"]["top-voted-lynch"] && !this.hammerActive()
		if (!this.hammerActive() && !this.config.game.lynch["top-voted-lynch"]) {
			if (before < required && after >= required) {
				// New lynch
				if (identifier === "nl") await executable.misc.nolynchReached(this)
				else await executable.misc.lynchReached(this, role)
			} else if (before >= required && after < required) {
				if (identifier === "nl") await executable.misc.nolynchOff(this)
				else await executable.misc.lynchOff(this, role)
			}
		}
	}

	private async checkLynchHammer(): Promise<boolean> {
		const no_lynch_votes = this.getNoLynchVoteCount()

		if (no_lynch_votes >= this.getNoLynchVotesRequired()) {
			await this.fastforward()
			return true
		}

		// Checks for all potential hammers
		for (let i = 0; i < this.players.length; i++) {
			const votes = this.players[i].countVotes()
			const required = this.getVotesRequired() - this.players[i].getVoteOffset()

			if (votes >= required) {
				// Execute the player
				//var success = this.lynch(this.players[i]);

				// Fastforward cycle
				await this.fastforward()
				return true
			}
		}

		return false
	}

	reloadTrialVoteMessage(): Promise<void> {
		return executable.misc.editTrialVote(this)
	}

	private async clearAllVotesBy(identifier: string): Promise<boolean> {
		// Clears all the votes on other people
		// by id specified

		let cleared = false

		for (let i = 0; i < this.players.length; i++) {
			cleared = cleared || (await this.players[i].clearVotesBy(identifier))
		}
		return cleared
	}

	async clearVotes(edit_trial = false): Promise<void> {
		// Clear ALL votes
		this.players.forEach((player) => player.clearVotes())

		if (edit_trial) {
			await this.reloadTrialVoteMessage()
		}
	}

	isAlive(id: string): boolean {
		return this.getAlivePlayers().some((player) => player.id === id || player.identifier === id)
	}

	async step(adjust_to_current_time = false): Promise<Date | null> {
		const calculateNextAction = (time: Date, period: number, config: LcnConfig) => {
			const divided = period % 2

			// Clone time obj
			time = new Date(time)

			if (divided === 0) {
				// Daytime
				time.setUTCHours(time.getUTCHours() + config.time.day)
			} else {
				time.setUTCHours(time.getUTCHours() + config.time.night)
			}

			return time
		}

		// Synced with Timer class
		// Should return next date

		// this.config.time.day

		const addition = this.state === GameState.PRE_GAME ? 0 : 1

		if (adjust_to_current_time) {
			this.current_time = new Date()

			const time = new Date()
			time.setUTCHours(time.getUTCHours() + 1, 0, 0, 0)

			this.next_action = calculateNextAction(time, this.period + addition, this.config)
		} else {
			this.current_time = new Date(this.next_action || new Date())
			this.next_action = calculateNextAction(this.next_action || new Date(), this.period + addition, this.config)
		}

		if (this.state === GameState.PRE_GAME) {
			this.routines()
			await this.cycle()
			await this.start()

			// Periodic updates are handled in roles/postRoleIntroduction
			// because of async issues

			// Player routines in start
			//this.playerRoutines();

			await this.execute("postcycle", { period: this.period })
		} else if (this.state === GameState.PLAYING) {
			this.voting_halted = true

			// Print period in private channel
			await this.messagePeriodicUpdate(1)

			// Handles actions,
			// closes trial votes, etc.
			// i.e. dawn/dusk time
			await this.precycle()

			this.steps += 1
			this.period += 1

			// Create period log
			this.routines()

			// Broadcast
			const broadcast = await this.getBroadcast(-1, true)
			await executable.misc.postNewPeriod(this, broadcast)

			// Win check
			await this.checkWin()

			if ((this.state as GameState) === GameState.ENDED) {
				await this.save()
				return null
			}

			// Open Mafia chat, create votes, routine stuff
			await this.cycle()

			// Player routines - configurable
			await this.playerRoutines()

			if (!this.isDay()) {
				for (const player of this.getAlivePlayers()) {
					await player.sendFFStatusMessage()
				}
			}

			await this.execute("postcycle", { period: this.period })
		} else {
			return null
		}

		// Save
		this.voting_halted = false

		await this.save()

		return this.next_action || null
	}

	async fastforward(): Promise<void> {
		this.voting_halted = true
		const timer = this.timer
		if (!timer) {
			throw new Error("No timer")
		}
		return await timer.fastforward()
	}

	private async precycle() {
		await this.clearPeriodPins()

		if (this.period % 2 === 0) {
			await executable.misc.editTrialVote(this, true)
			await this.clearTrialVoteReactions()

			// Dusk
			await this.checkLynches()
			await this.clearVotes()
		}

		await this.execute("cycle", { period: this.period })
		this.enterDeathMessages()
		await this.sendMessages()
	}

	private async messagePeriodicUpdate(offset = 0) {
		await this.messageAll(
			"~~                                              ~~    **" + this.getFormattedDay(offset) + "**",
			"permanent"
		)
	}

	private async messageAll(message: string, pin: "period" | "permanent" | null = null) {
		const channels = filterDefined(
			getUniqueBy(
				this.getAlivePlayers().flatMap((p) => p.special_channels),
				(ch) => ch.id
			).map(({ id }) => this.getChannelById(id) || undefined)
		)
		for (const channel of channels) {
			if (pin === "period") {
				await this.sendPeriodPin(channel, message)
			} else if (pin === "permanent") {
				await this.sendPin(channel, message)
			} else {
				await channel.send(message)
			}
			await auxils.delay(100)
		}
	}

	async cycle(): Promise<void> {
		for (const expansion of expansions) {
			const { cycle } = expansion.scripts
			if (cycle) {
				await cycle(this)
			}
		}

		if (this.period % 2 === 0) {
			await this.day()
		} else {
			await this.night()
		}
	}

	async day(): Promise<void> {
		// Executed at the start of daytime

		if (this.game_start_message_sent) {
			await this.createTrialVote()
		}
		await executable.misc.openMainChats(this)
	}

	async night(): Promise<void> {
		// Executed at the start of nighttime

		if (!this.config.game.town["night-chat"]) {
			await executable.misc.lockMainChats(this)
		} else {
			await executable.misc.openMainChats(this)
		}
		await this.checkFastForward()
	}

	private async createPeriodPin(message: Message): Promise<boolean> {
		const log = this.getPeriodLog()

		const result = await executable.misc.pinMessage(message)

		if (result) {
			const jx = {
				message: message.id,
				channel: message.channel.id,
				pin_time: new Date(),
			}
			log.pins.push(jx)
		}
		return result
	}

	async createPin(message: Message): Promise<boolean> {
		return executable.misc.pinMessage(message)
	}

	async sendPeriodPin(channel: TextChannel, message: string): Promise<void> {
		const out = await channel.send(message)
		await this.createPeriodPin(out)
	}

	async sendPin(channel: TextChannel, message: string): Promise<void> {
		const out = await channel.send(message)
		await this.createPin(out)
	}

	async checkLynches(): Promise<void> {
		// Find players who will be lynched

		let lynchable = []

		for (let i = 0; i < this.players.length; i++) {
			if (!this.players[i].isAlive()) {
				continue
			}

			const votes = this.players[i].countVotes()
			const required = this.getVotesRequired() - this.players[i].getVoteOffset()

			const top_voted_lynch =
				this.config.game.lynch["top-voted-lynch"] &&
				votes >= this.config.game.lynch["top-voted-lynch-minimum-votes"]

			if (votes >= required || top_voted_lynch) {
				// Execute the player
				//var success = this.lynch(this.players[i]);

				lynchable.push({
					player: this.players[i],
					score: votes - required,
					votes: votes,
				})
			}
		}

		const lynches_available = this.getLynchesAvailable()

		lynchable = auxils.cryptographicShuffle(lynchable)

		lynchable.sort(function (a, b) {
			return b.score - a.score
		})

		const lynched = []
		const no_lynch_votes = this.getNoLynchVoteCount()
		const top_voted_lynch = this.config.game.lynch["top-voted-lynch"]

		// Check no-lynch
		if (no_lynch_votes < this.getNoLynchVotesRequired() || top_voted_lynch) {
			while (lynchable.length > 0 && lynches_available > lynched.length) {
				const score = lynchable[0].score
				const votes = lynchable[0].votes
				const target = lynchable[0].player

				// Checks popularity of no lynch votes
				if (votes <= no_lynch_votes) {
					break
				}

				// Encased in loop in event of > 2 lynches available and second-ups are tied
				if (
					lynchable.filter((x) => x.score === score).length > lynches_available - lynched.length &&
					!this.config.game.lynch["tied-random"]
				) {
					// Stop further lynch
					break
				}

				const success = await this.lynch(target)

				if (success) {
					lynched.push(target)
				}

				lynchable.splice(0, 1)
			}
		}

		// Successful lynches go into lynched
		// Broadcast the lynches in the main channel
		await executable.misc.broadcastMainLynch(this, lynched)
	}

	async lynch(role: Player): Promise<boolean> {
		const success = await executable.misc.lynch(this, role)

		// Add lynch summary
		if (success) {
			await this.silentKill(role, "__lynched__", "lynched")
		}
		return success
	}

	async kill(
		role: Player,
		reason: string,
		secondary_reason?: string,
		broadcast_position_offset = 0,
		circumstances: KillCircumstances = {}
	): Promise<void> {
		// Secondary reason is what the player sees
		// Can be used to mask death but show true
		// reason of death to the player killed
		await this.silentKill(role, reason, secondary_reason, broadcast_position_offset, circumstances)

		if (this.getPeriodLog() && this.getPeriodLog().trial_vote) {
			await this.clearAllVotesFromAndTo(role.identifier)
			await this.reloadTrialVoteMessage()
			await this.checkLynchHammer()
		}
	}

	async silentKill(
		player: Player,
		reason: string,
		secondary_reason?: string,
		broadcast_position_offset = 0,
		circumstances: KillCircumstances = {}
	): Promise<void> {
		// Work in progress, should remove emote
		/*
    if (this.getPeriodLog() && this.getPeriodLog().trial_vote) {
      executable.misc.removePlayerEmote(this, role.identifier);
    };
    */

		// Secondary reason is what the player sees
		// Can be used to mask death but show true
		// reason of death to the player killed
		await this.execute("killed", {
			target: player.identifier,
			circumstances: circumstances,
		})
		for (const part of player.role.allParts) {
			await part.onDeath(player, circumstances)
		}

		await executable.misc.kill(this, player)
		this.primeDeathMessages(player, reason, secondary_reason, broadcast_position_offset, circumstances)
	}

	async modkill(player: Player): Promise<boolean> {
		if (player.hasPrivateChannel()) {
			await player.getPrivateChannel().send(":exclamation: You have been removed from the game by a moderator.")
		}

		await executable.admin.modkill(this, player)
		return true
	}

	primeDeathMessages(
		role: Player,
		reason: string,
		secondary?: string,
		broadcast_position_offset = 0,
		circumstances: KillCircumstances = {}
	): void {
		this.addDeathBroadcast(role, reason, broadcast_position_offset, circumstances)

		if (secondary) {
			this.addDeathMessage(role, secondary)
		} else {
			this.addDeathMessage(role, reason)
		}
	}

	enterDeathMessages(offset = 0): void {
		const log = this.getPeriodLog(offset)

		// {role, reason}
		const registers = Array.from(log.death_messages)

		const messages: Record<string, string[]> = {}

		registers.forEach((register) => {
			const identifier = register.role
			if (!messages[identifier]) {
				messages[identifier] = []
			}
			messages[identifier].push(register.reason)
		})

		const keys = Object.keys(messages)

		for (let i = 0; i < keys.length; i++) {
			const identifier = keys[i]
			const role = this.getPlayerByIdentifier(identifier)
			if (role == null) {
				this.logger.logError(new Error(`Unable to find player with identifier ${identifier}`))
				continue
			}
			const reason = auxils.pettyFormat(messages[keys[i]])

			const message = executable.misc.getDeathMessage(this, role, reason)

			this.addMessage(role, message)
		}
	}

	async enterDeathBroadcasts(offset = 0): Promise<void> {
		// Enters in from log.death_broadcasts
		const log = this.getPeriodLog(offset)

		const registers = Array.from(log.death_broadcasts)

		registers.sort((a, b) => a.position_offset - b.position_offset)

		const unique = getUniqueArray(registers.map((r) => r.playerId))

		const cause_of_death_config = this.config.game["cause-of-death"]
		const exceptions = cause_of_death_config.exceptions

		// Inverted
		const hide_day = cause_of_death_config["hide-day"] && !this.isDay()
		const hide_night = cause_of_death_config["hide-night"] && this.isDay()

		for (const item of unique) {
			const role = this.getPlayerByIdentifier(item)
			if (!role) {
				this.logger.logError(new Error(`No player found with identifier ${item}`))
				return
			}

			const reasons = []
			for (const register of registers.filter((register) => register.playerId === item)) {
				let exempt = false

				// TODO: fix
				for (const exception of exceptions) {
					if (register.reason.includes(exception)) {
						exempt = true
						break
					}
				}

				if (!(hide_day || hide_night) || exempt) {
					reasons.push(register.reason)
				}
			}

			if (reasons.length < 1) {
				reasons.push("found dead")
			}

			const reason = auxils.pettyFormat(reasons)

			const message = executable.misc.getDeathBroadcast(this, role, reason)

			this.addBroadcastSummary(message, offset)
		}

		await this.uploadPublicRoleInformation(unique)
	}

	private async uploadPublicRoleInformation(playerIdentifiers: string[]): Promise<void> {
		const display: Player[] = []

		for (let i = 0; i < playerIdentifiers.length; i++) {
			const player = this.getPlayerOrThrow(playerIdentifiers[i])
			display.push(player)
		}
		await executable.roles.uploadPublicRoleInformation(this, display)
	}

	private addDeathBroadcast(player: Player, reason: string, position_offset = 0, circumstances: KillCircumstances) {
		const log = this.getPeriodLog()

		log.death_broadcasts.push({
			playerId: player.identifier,
			reason,
			position_offset,
			circumstances,
		})
	}

	addBroadcastSummary(message: string, offset = 0): void {
		const log = this.getPeriodLog(offset)

		log.summary.push({ message: message, time: new Date() })
	}

	addDeathMessage(role: Player, reason: string): void {
		const log = this.getPeriodLog()

		log.death_messages.push({ role: role.identifier, reason: reason })
	}

	addMessage(role: Player, message: string): void {
		const log = this.getPeriodLog()

		log.messages.push({
			message: message,
			recipient: role.identifier,
			time: new Date(),
		})
	}

	async getBroadcast(offset = 0, enter = false): Promise<string | undefined> {
		if (enter) {
			await this.enterDeathBroadcasts(offset)
		}

		// Get the summary broadcast

		const log = this.getPeriodLog(offset)

		const broadcasts = log.summary

		if (broadcasts.length < 1) {
			return undefined
		} else {
			const concat = []

			for (let i = 0; i < broadcasts.length; i++) {
				concat.push(broadcasts[i].message)
			}

			return concat.join("\n\n")
		}
	}

	private async sendMessages(offset = 0) {
		// Actually sends messages

		const log = this.getPeriodLog(offset)

		const messages = log.messages

		for (let i = 0; i < messages.length; i++) {
			const message = messages[i].message

			await executable.misc.sendIndivMessage(this, messages[i].recipient, message)

			await auxils.delay(80)
		}
	}

	private async clearPeriodPins(): Promise<void> {
		// Clears the pinned messages in the period log

		const log = this.getPeriodLog()
		const pins = log.pins

		for (let i = 0; i < pins.length; i++) {
			const pin = pins[i]
			await executable.misc.unpinMessage(this, pin.channel, pin.message)
		}
	}

	getGuildMember(id: Snowflake): GuildMember | null {
		const guild = this.getGuild()
		return guild.members.cache.get(id) || null
	}

	private async start() {
		this.state = GameState.PLAYING

		for (let i = expansions.length - 1; i >= 0; i--) {
			const game_start = expansions[i].scripts.game_start

			if (!game_start) {
				continue
			}

			await game_start(this)
		}

		const cache = this.players.map((player) => player.start())
		this.actions.refreshActionables()

		this.game_start_message_sent = true

		await executable.misc.postGameStart(this)

		setTimeout(() => {
			this.createTrialVote().catch((e) => this.logger.logError(e))
		}, 1600)

		await Promise.all(cache)

		if (!this.isDay() && !this.config.game.town["night-chat"]) {
			await executable.misc.lockMainChats(this)
		} else {
			await executable.misc.openMainChats(this)
		}

		for (let i = expansions.length - 1; i >= 0; i--) {
			const game_secondary_start = expansions[i].scripts.game_secondary_start

			if (!game_secondary_start) {
				continue
			}

			await game_secondary_start(this)
		}
	}

	private routines() {
		// Check day night cycles, also used on refresh
		// Should not put post functions in here,
		// only administrative junk

		let trials = Math.max(
			this.config.game["minimum-trials"],
			Math.ceil(this.config.game["lynch-ratio-floored"] * this.getAlive())
		)

		// Clear fast forward votes
		this.clearFastForwardVotes()

		for (let i = 0; i < this.trial_vote_operations.length; i++) {
			const operation = this.trial_vote_operations[i].operation
			trials = auxils.operations[operation](trials, this.trial_vote_operations[i].amount)
		}

		// Clear TV operations
		this.trial_vote_operations = []

		this.period_log[this.period.toString()] = {
			trials: trials,
			summary: [],
			death_broadcasts: [],
			death_messages: [],
			messages: [],
			trial_vote: null,
			no_lynch_vote: [],
			period: this.period,
			pins: [],
			special_vote_types: [],
		}
	}

	private clearFastForwardVotes(): void {
		for (const player of this.players) {
			if (player.ffstatus == FFStatus.ON) {
				player.ffstatus = FFStatus.OFF
			}
		}
		this.fastForwarded = false
	}

	addTrialVoteOperation(operation: OperationType, amount: number): void {
		const allowed = ["addition", "subtraction", "multiplication", "division", "modulo", "max", "min"]

		if (!allowed.includes(operation)) {
			throw new Error("Operation " + operation + " is not allowed!")
		}

		this.trial_vote_operations.push({ operation, amount })
	}

	private async playerRoutines(): Promise<void> {
		for (let i = 0; i < this.players.length; i++) {
			await auxils.delay(100)
			await this.players[i].__routines()
		}
	}

	getLynchesAvailable(offset = 0): number {
		const log = this.getPeriodLog(offset)
		return log.trials
	}

	getPeriodLog(offset = 0): PeriodLogEntry {
		return this.period_log[(this.period + offset).toString()]
	}

	getAllPeriodLogEntries(): PeriodLogEntry[] {
		return Object.values(this.period_log)
	}

	getVotesRequired(): number {
		const alive = this.getAlive()

		// Floored of alive
		//return 1;
		return Math.max(this.config.game["minimum-lynch-votes"], Math.floor(alive / 2) + 1)
	}

	getNoLynchVotesRequired(): number {
		const alive = this.getAlive()

		// Ceiled of alive
		return Math.max(this.config.game["minimum-nolynch-votes"], Math.ceil(alive / 2))
	}

	getDiscordUser(alphabet: string): User | null {
		const player = this.getPlayerByAlphabet(alphabet)
		if (!player) {
			return null
		}

		return this.client.users.cache.get(player.id) || null
	}

	setPresence(presence: PresenceData): Promise<void> {
		return executable.misc.updatePresence(this.client, presence)
	}

	getFormattedDay(offset = 0): string {
		const period = this.period + offset

		const numeral = Math.ceil(0.5 * period)

		const flavour = this.getGameFlavour()

		if (flavour && flavour.info["step-names"]) {
			const step_names = flavour.info["step-names"]
			const step = this.getStep() + offset

			const index = step % step_names.length

			return `${step_names[index]} ${numeral}`
		}

		if (period % 2 === 0) {
			return `Day ${numeral}`
		} else {
			return `Night ${numeral}`
		}
	}

	async save(saveFolder?: string): Promise<void> {
		await saveGame(this, saveFolder)
	}

	tentativeSave(silent?: boolean, bufferTime?: number): void {
		this.timer?.tentativeSave(silent, bufferTime)
	}

	format(string: string): string {
		return executable.misc.__formatter(this, string)
	}

	async reinstantiate(timer: Timer): Promise<void> {
		this.timer = timer

		if (this.game_config_override) {
			this.config.game = auxils.objectOverride(this.config.game, this.game_config_override)
		} else {
			this.game_config_override = {}
		}

		// Check role/attribute incompatibility
		let incompatible = this.players.flatMap((player) => player.verifyProperties())

		if (this.flavour_identifier && !flavours[this.flavour_identifier]) {
			incompatible = [
				...incompatible,
				{
					type: "flavour",
					identifier: this.flavour_identifier,
				},
			]
		}

		if (incompatible.length > 0) {
			const errors = [
				{
					type: "role",
					items: auxils.getUniqueArray(
						incompatible.filter((x) => x.type === "role").map((x) => x.identifier)
					),
				},
				{
					type: "attribute",
					items: auxils.getUniqueArray(
						incompatible.filter((x) => x.type === "attribute").map((x) => x.identifier)
					),
				},
				{
					type: "flavour",
					items: auxils.getUniqueArray(
						incompatible.filter((x) => x.type === "flavour").map((x) => x.identifier)
					),
				},
			]

			for (let i = 0; i < errors.length; i++) {
				if (errors[i].items.length > 0) {
					this.logger.log(3, "\nError loading type " + errors[i].type + ":")
					console.table(errors[i].items)
				}
			}

			throw new Error(
				'Stopped save reload due to role/attribute incompatibilities. Make sure expansions required for this save can be loaded (you can also check config/playing.json\'s "expansions" field). Restart the bot when ready. Key "uninstantiate" to delete saves.\n'
			)
		}
		await this.instantiateTrialVoteCollector()
		this.actions.refreshActionables()
	}

	addAction<T>(
		identifier: string,
		triggers: Trigger[],
		options: ActionOptions<T>,
		rearrange = true
	): Promise<Actionable<T>> {
		// Inherits
		return this.actions.add(identifier, triggers, options, rearrange)
	}

	async execute(type: Trigger, params: ExecutionParams, check_expiries = true): Promise<void> {
		await this.actions.execute(type, params, check_expiries)
	}

	getPlayerMatch(name: string): { score: number; player: Player } {
		// Check if name is alphabet

		let player = this.getPlayerByAlphabet(name)
		let score: number

		if (player === null) {
			const distances = []

			for (let i = 0; i < this.players.length; i++) {
				const member = this.players[i].getGuildMember()

				if (member === undefined) {
					distances.push(-1)
					continue
				}

				const nickname = member.displayName
				const username = member.user.username

				// Calculate Levenshtein Distance
				// Ratio'd

				const s_username = auxils.hybridisedStringComparison(name.toLowerCase(), username.toLowerCase())
				const s_nickname = auxils.hybridisedStringComparison(name.toLowerCase(), nickname.toLowerCase())

				const distance = Math.max(s_username, s_nickname)
				distances.push(distance)
			}

			// Compare distances
			const best_match_index = distances.indexOf(Math.max(...distances))

			score = distances[best_match_index]
			player = this.players[best_match_index]
		} else {
			score = Infinity
		}
		return { score, player }
	}

	findPlayer(condition: PlayerPredicate): Player | null {
		return this.players.find(condition) || null
	}

	findAllPlayers(condition: PlayerPredicate): Player[] {
		return this.players.filter(condition)
	}

	playerExists(condition: PlayerPredicate): boolean {
		return this.players.some(condition)
	}

	checkWin(): Promise<void> {
		return executable.wins.checkWin(this)
	}

	async endGame(): Promise<void> {
		this.logger.log(2, "Game ended!")

		await executable.conclusion.endGame(this)

		await this.getMainChannel().send(this.config.messages["game-over"])

		await this.clearTrialVoteReactions()

		// End the game
		this.state = GameState.ENDED
		if (this.timer) {
			await this.timer.updatePresence()
		}
	}

	getGuild(): Guild {
		return getGuild(this.client)
	}

	async postWinLog(): Promise<void> {
		if (this.win_log) {
			await executable.misc.postWinLog(this, this.win_log.faction, this.win_log.caption)
		} else {
			this.logger.log(3, "The win log has not been primed!")
		}
	}

	primeWinLog(faction: string, caption: string): void {
		this.win_log = { faction: faction, caption: caption }
	}

	getRolesChannel(): TextChannel {
		return this.findTextChannel(this.config.channels.roles)
	}

	getLogChannel(): TextChannel {
		return this.findTextChannel(this.config.channels.log)
	}

	getMainChannel(): TextChannel {
		return this.findTextChannel(this.config.channels.main)
	}

	getWhisperLogChannel(): TextChannel {
		return this.findTextChannel(this.config.channels["whisper-log"])
	}

	getPeriod(): number {
		return this.period
	}

	getStep(): number {
		return this.steps
	}

	isDay(): boolean {
		return this.getPeriod() % 2 === 0
	}

	isNight(): boolean {
		return this.getPeriod() % 2 === 1
	}

	async setWin(role: Player): Promise<void> {
		await executable.misc.postWinMessage(role)
		role.setWin()
	}

	async setWins(roles: Player[]): Promise<void> {
		for (let i = 0; i < roles.length; i++) {
			await this.setWin(roles[i])
		}
	}

	async createPrivateChannel(channelName: string, permissions: RolePermission[]): Promise<TextChannel> {
		return executable.misc.createPrivateChannel(this, channelName, permissions)
	}

	postPrimeLog(): Promise<void> {
		return executable.misc.postPrimeMessage(this)
	}

	postDelayNotice(): Promise<void> {
		return executable.misc.postDelayNotice(this)
	}

	substitute(id1: string, id2: string, detailed_substitution: boolean): Promise<void> {
		return executable.admin.substitute(this, id1, id2, detailed_substitution)
	}

	clearPreemptiveVotes(): void {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].clearPreemptiveVotes()
		}
	}

	async loadPreemptiveVotes(clear_cache = true): Promise<void> {
		const lynches = this.getLynchesAvailable()

		for (let i = 0; i < this.players.length; i++) {
			const player = this.players[i]
			const votes = player.getPreemtiveVotes() || []

			if (!player.isAlive()) {
				continue
			}

			const amount = Math.min(lynches - this.votesFrom(player.identifier).length, votes.length)
			const successes = []

			for (let j = 0; j < votes.length; j++) {
				// Check if player is votable
				const current = this.getPlayerByIdentifier(votes[i])
				if (current == null) {
					this.logger.log(1, `Unknown player ${votes[i]}`)
					continue
				}

				const already_voted = current.isVotedAgainstBy(player.identifier)
				const alive = current.isAlive()

				if (alive && !already_voted) {
					await this.toggleVote(player, current)

					successes.push(current)

					if (successes.length >= amount) {
						break
					}
				}
			}

			if (successes.length > 0) {
				await executable.misc.sendPreemptMessage(player, successes)
			}
		}

		if (clear_cache) {
			this.clearPreemptiveVotes()
		}
	}

	getGameFlavour(): FlavourData | null {
		const flavour_identifier = this.flavour_identifier

		if (!flavour_identifier) {
			// No flavour
			return null
		}

		const flavour = flavours[flavour_identifier]

		if (!flavour) {
			this.logger.log(3, "Invalid flavour " + flavour_identifier + "! Defaulting to no flavour.")
			return null
		}

		return flavour
	}

	async checkFastForward(): Promise<void> {
		if (this.fastForwarded) {
			return
		}
		const players = this.players.filter((p) => p.status.alive)
		if (!players.every((player) => player.ffstatus === FFStatus.AUTO || player.ffstatus === FFStatus.ON)) {
			return
		}

		this.addBroadcastSummary(formatEmoji(this.config.emoji.ff) + "  The night was **fastforwarded**.")
		await this.fastforward()
	}

	async getDiscordRoleOrThrow(roleType: keyof PermissionsConfig): Promise<Role> {
		const name = this.config.permissions[roleType]
		const cachedRole = this.getGuild().roles.cache.find((r) => r.name === name)
		if (cachedRole) {
			return cachedRole
		}
		//Update from discord to make sure nothing has changed
		const fetchedRole = (await this.getGuild().roles.fetch(undefined, true)).cache.find((r) => r.name === name)
		if (fetchedRole) {
			return fetchedRole
		}
		throw new Error(`No role found with name '${name}'`)
	}

	doesPlayerExist(condition: string | PlayerPredicate): boolean {
		if (typeof condition === "function") {
			// Check
			return this.playerExists(condition)
		} else {
			condition = condition.toLowerCase()

			// Check separately
			const cond1 = this.playerExists(
				(x) => x.isAlive() && x.role.allPartsMetadata.some((meta) => meta.identifier === condition)
			)
			const cond2 = this.playerExists((x) => x.isAlive() && x.role.properties.alignment.id === condition)

			return cond1 || cond2
		}
	}

	checkRoles(...conditions: string[]): boolean {
		let ret = false

		for (let i = 0; i < conditions.length; i++) {
			ret = ret || this.doesPlayerExist(conditions[i])
		}

		return ret
	}

	getNoLynchVoters(): string[] {
		const no_lynch_vote = this.getPeriodLog().no_lynch_vote

		return no_lynch_vote.map((vote) => vote.identifier)
	}

	getNoLynchVoteCount(): number {
		let count = 0
		const no_lynch_vote = this.getPeriodLog().no_lynch_vote

		for (let i = 0; i < no_lynch_vote.length; i++) {
			count += no_lynch_vote[i].magnitude
		}
		return count
	}

	getSpecialVoteCount(identifier: string): number {
		const special_vote = this.getPeriodLog().special_vote_types.find((x) => x.identifier === identifier)

		if (!special_vote) {
			return 0
		}

		let count = 0
		for (let i = 0; i < special_vote.voters.length; i++) {
			count += special_vote.voters[i].magnitude
		}

		return count
	}

	private async addNoLynchVote(identifier: string, magnitude: number) {
		const no_lynch_vote = this.getPeriodLog().no_lynch_vote

		no_lynch_vote.push({ identifier: identifier, magnitude: magnitude })
		await this.execute("vote", { target: "nl", voter: identifier })
	}

	async clearNoLynchVotesBy(identifier: string): Promise<boolean> {
		const no_lynch_vote = this.getPeriodLog().no_lynch_vote

		let cleared = false

		for (let i = no_lynch_vote.length - 1; i >= 0; i--) {
			if (no_lynch_vote[i].identifier === identifier) {
				no_lynch_vote.splice(i, 1)
				cleared = true
			}
		}

		if (cleared) {
			await this.execute("unvote", { target: "nl", voter: identifier })
		}

		return cleared
	}

	clearNoLynchVotes(): void {
		this.getPeriodLog().no_lynch_vote = []
	}

	isVotingNoLynch(identifier: string): boolean {
		return this.getNoLynchVoters().includes(identifier)
	}

	hammerActive(): boolean {
		const trials_available = this.getTrialsAvailable()

		return this.config.game.lynch["allow-hammer"] && trials_available < 2
	}

	getTrialsAvailable(): number {
		const period_log = this.getPeriodLog()
		if (period_log) {
			return period_log.trials
		}
		return Math.max(
			this.config.game["minimum-trials"],
			Math.ceil(this.config.game["lynch-ratio-floored"] * this.getAlive())
		)
	}

	clearAllVotesOn(identifier: string): void {
		const player = this.getPlayerByIdentifier(identifier)
		if (player) {
			player.clearVotes()
		}
	}

	private async clearAllVotesFromAndTo(identifier: string) {
		// Stops votes to and from player
		await this.clearNoLynchVotesBy(identifier)
		await this.clearAllVotesBy(identifier)
		this.clearAllVotesOn(identifier)
	}

	addIntroMessage(channel_id: string, message: string): void {
		this.intro_messages.push({ channel_id, message })
	}

	async postIntroMessages(): Promise<void> {
		for (let i = 0; i < this.intro_messages.length; i++) {
			const channel = this.findTextChannel(this.intro_messages[i].channel_id)
			await channel.send(this.intro_messages[i].message)
		}
	}

	setGameConfigOverride(game_config: GameConfig, update_immediately = true): void {
		this.game_config_override = auxils.objectOverride(this.game_config_override, game_config)

		if (update_immediately) {
			this.config.game = auxils.objectOverride(this.config.game, this.game_config_override)
		}
	}

	get logger(): Logger {
		return getLogger()
	}
}

export default Game
