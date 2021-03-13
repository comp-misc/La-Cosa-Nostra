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
	Snowflake,
	TextChannel,
	User,
} from "discord.js"
import getGuild from "../../getGuild"
import getLogger from "../../getLogger"
import lcn from "../../lcn"
import { LcnConfig, GameConfig } from "../../LcnConfig"
import alphabets from "../alpha_table"
import auxils from "../auxils"
import executable from "../executable"
import { RolePermission } from "../executable_misc/createPrivateChannel"
import expansions from "../expansions"
import flavours, { FlavourData } from "../flavours"
import Actions, { Actionable, ActionOptions, ExecutionParams, Trigger } from "./Actions"
import Logger from "./Logger"
import Player, { PlayerProperty } from "./Player"
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
	role: string
	reason: string
	position_offset: number
}
export interface DeathMessage {
	role: string
	reason: string
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
	logger: Logger
	client: Client
	init_time: Date
	config: LcnConfig
	players: Player[]
	players_tracked: number
	voting_halted: boolean
	game_start_message_sent: boolean
	timezone: number
	start_time: Date | undefined
	current_time: Date | undefined
	next_action: Date | undefined
	actions: Actions
	channels: Record<string, ChannelMeta>
	intro_messages: IntroMessage[]
	period: number
	steps: number
	state: GameState
	game_config_override: Record<string, unknown> | undefined
	flavour_identifier: string
	timer: Timer | undefined
	timer_identifier: string | undefined
	fast_forward_votes: string[]
	trial_vote_operations: TrialVoteOperation[]
	private period_log: Record<string, PeriodLogEntry>
	private previously_uploaded_role_info: string[]
	private win_log: WinLog | undefined
	private trial_collectors: ReactionCollector[]
	tampered_load_times?: Date[]

	constructor(client: Client, config: LcnConfig, players: Player[]) {
		this.logger = getLogger()
		this.client = client
		this.config = config
		this.trial_collectors = []

		this.players = players
		this.init_time = new Date()

		this.actions = new Actions(this)

		this.trial_vote_operations = []

		this.players_tracked = players.length

		this.fast_forward_votes = []

		this.channels = {}

		this.period_log = {}

		this.intro_messages = []
		this.previously_uploaded_role_info = []

		this.period = this.config["game"]["day-zero"] ? 0 : 1
		this.steps = 0
		this.state = GameState.PRE_GAME

		if (!this.config.playing.flavour) {
			throw new Error("No flavour defined in config")
		}
		this.flavour_identifier = this.config.playing.flavour

		this.voting_halted = false
		this.game_start_message_sent = false

		this.game_config_override = {}

		// Timezone is GMT relative
		this.timezone = this.config.time.timezone

		for (let i = expansions.length - 1; i >= 0; i--) {
			const game_init = expansions[i].scripts.game_init

			if (!game_init) {
				continue
			}

			this.game_start_message_sent = false

			game_init(this)
		}

		this.primeDesignatedTime()

		this.players.forEach((player) => {
			player.setGame(this)
			player.postGameInit()
		})
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
		const channel = channels.find((channel) => channel.id === name) || channels.find((channel) => channel.name === name)
		if (!channel) {
			throw new Error(`Unknown channel ${name}`)
		}
		if (!(channel instanceof TextChannel)) {
			throw new Error(`Invalid text channel ${name}`)
		}
		return channel
	}

	getChannelById(id: Snowflake): TextChannel | null {
		const channel = this.getGuild().channels.get(id)
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

	getPlayerByIdOrThrow(id: string): Player {
		const player = this.getPlayerById(id)
		if (!player) {
			throw new Error(`Failed to find player with id '${id}'`)
		}
		return player
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

	async createTrialVote(load_preemptives = true): Promise<void> {
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

			this.save()

			this.instantiateTrialVoteCollector()

			if (load_preemptives) {
				this.loadPreemptiveVotes()
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
			period_log.trial_vote.messages.map((messageId: string) => channel.fetchMessage(messageId))
		)
		messages.forEach((message) => {
			const collector = message.createReactionCollector(() => true)
			this.trial_collectors.push(collector)
			collector.on("collect", (reaction) => {
				reaction.users.forEach((user) => this.receivedTrialVote(reaction, user))
			})
		})
	}

	clearTrialVoteCollectors(): void {
		// Remove promises to free up memory
		this.trial_collectors.forEach((collector) => collector.stop("Autocleared"))
	}

	clearTrialVoteReactions(remove_extra = true): void {
		const period_log = this.getPeriodLog()

		if (period_log.trial_vote === null) {
			return
		}

		const channel_id = period_log.trial_vote.channel
		const messages_id = period_log.trial_vote.messages

		for (let i = 0; i < messages_id.length; i++) {
			if (i < 1 || !remove_extra) {
				executable.misc.clearReactions(this, channel_id, messages_id[i])
			}

			if (i > 0 && remove_extra) {
				executable.misc.deleteMessage(this, channel_id, messages_id[i])
			}
		}

		this.clearTrialVoteCollectors()
	}

	private async receivedTrialVote(reaction: MessageReaction, user: User): Promise<void> {
		if (user.bot) {
			return
		}

		reaction.remove(user)

		if (!this.isAlive(user.id)) {
			this.logger.log(3, user.id + " tried to vote on the trial although they are either dead or not in the game!")
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
					this.toggleVote(voter, player, true)
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
			if (!this.config["game"]["lynch"]["no-lynch-option"]) {
				this.logger.log(3, user.id + " tried voting no-lynch using the reaction poll but no-lynches are disabled!")
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

		this.toggleVote(voter, voted_against)
	}

	toggleVote(voter: Player, voted_against: VoteTarget, special_vote = false): boolean {
		// Post corresponding messages

		if (this.voting_halted) {
			return false
		}

		if (voter.getStatus("voteBlocked")) {
			return false
		}

		const no_lynch_vote = voted_against === "nl" && !special_vote
		const voted_no_lynch = this.isVotingNoLynch(voter.identifier)

		// Check for (a) singular (b) total lynch counts
		const special_vote_types = this.getPeriodLog().special_vote_types
		const special_votes_from = special_vote_types.filter((x) => x.voters.some((y) => y.identifier === voter.identifier))
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
				this.clearNoLynchVotesBy(voter.identifier)
				executable.misc.removedNolynch(this, voter)
			} else {
				this.addNoLynchVote(voter.identifier, magnitude)
				executable.misc.addedNolynch(this, voter)
			}

			const after_votes = this.getNoLynchVoteCount()

			this.checkLynchAnnouncement("nl", before_votes, after_votes)
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

			const toggle_on = voted_against.toggleVotes(voter.identifier, magnitude)

			const after_votes = voted_against.countVotes()

			if (toggle_on) {
				// New vote
				// OLD SYSTEM: uses IDs directly
				executable.misc.addedLynch(this, voter, voted_against)
			} else {
				executable.misc.removedLynch(this, voter, voted_against)
			}

			this.checkLynchAnnouncement(voted_against.identifier, before_votes, after_votes)
		} else {
			// Special vote

			const special_vote = special_vote_types.find((x) => x.identifier === voted_against)

			if (voted_no_lynch) {
				return false
			}
			if (!special_vote) {
				this.logger.logError(new Error("No sepcial vote found"))
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
				this.execute("unvote", {
					target: "s/" + voted_against,
					voter: voter.identifier,
				})
			} else {
				special_vote.voters.push({
					identifier: voter.identifier,
					magnitude: magnitude,
				})
				this.execute("vote", {
					target: "s/" + voted_against,
					voter: voter.identifier,
				})
			}
		}

		this.reloadTrialVoteMessage()

		// Save file
		this.save()

		if (this.hammerActive() && !this.voting_halted) {
			this.checkLynchHammer()
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

	private checkLynchAnnouncement(identifier: string, before: number, after: number): void {
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
		if (!this.hammerActive() && !this.config["game"]["lynch"]["top-voted-lynch"]) {
			if (before < required && after >= required) {
				// New lynch
				identifier === "nl" ? executable.misc.nolynchReached(this) : executable.misc.lynchReached(this, role)
			} else if (before >= required && after < required) {
				identifier === "nl" ? executable.misc.nolynchOff(this) : executable.misc.lynchOff(this, role)
			}
		}
	}

	private checkLynchHammer(): boolean {
		const no_lynch_votes = this.getNoLynchVoteCount()

		if (no_lynch_votes >= this.getNoLynchVotesRequired()) {
			this.fastforward()
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
				this.fastforward()
				return true
			}
		}

		return false
	}

	reloadTrialVoteMessage(): void {
		executable.misc.editTrialVote(this)
	}

	clearAllVotesBy(identifier: string): boolean {
		// Clears all the votes on other people
		// by id specified

		let cleared = false

		for (let i = 0; i < this.players.length; i++) {
			cleared = cleared || this.players[i].clearVotesBy(identifier)
		}
		return cleared
	}

	clearVotes(edit_trial = false): void {
		// Clear ALL votes
		this.players.forEach((player) => player.clearVotes())

		if (edit_trial) {
			this.reloadTrialVoteMessage()
		}
	}

	isAlive(id: string): boolean {
		return this.getAlivePlayers().some((player) => player.id === id)
	}

	async step(adjust_to_current_time = false): Promise<Date | null> {
		const calculateNextAction = (time: Date, period: number, config: LcnConfig) => {
			const divided = period % 2

			// Clone time obj
			time = new Date(time)

			if (divided === 0) {
				// Daytime
				time.setUTCHours(time.getUTCHours() + config["time"]["day"])
			} else {
				time.setUTCHours(time.getUTCHours() + config["time"]["night"])
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
			this.cycle()
			await this.start()

			// Periodic updates are handled in roles/postRoleIntroduction
			// because of async issues

			// Player routines in start
			//this.playerRoutines();

			this.execute("postcycle", { period: this.period })
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
			const broadcast = this.getBroadcast(-1, true)
			await executable.misc.postNewPeriod(this, broadcast)

			// Win check
			this.checkWin()

			if ((this.state as any) === GameState.ENDED) {
				this.save()
				return null
			}

			// Open Mafia chat, create votes, routine stuff
			this.cycle()

			// Player routines - configurable
			await this.playerRoutines()

			this.execute("postcycle", { period: this.period })
		} else {
			return null
		}

		// Save
		this.voting_halted = false

		this.save()

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
		this.clearPeriodPins()

		if (this.period % 2 === 0) {
			await executable.misc.editTrialVote(this, true)
			this.clearTrialVoteReactions()

			// Dusk
			this.checkLynches()
			this.clearVotes()
		}

		this.execute("cycle", { period: this.period })
		this.enterDeathMessages()
		this.sendMessages()
	}

	private async messagePeriodicUpdate(offset = 0) {
		await this.messageAll(
			"~~                                              ~~    **" + this.getFormattedDay(offset) + "**",
			"permanent"
		)
	}

	private async messageAll(message: string, pin: "period" | "permanent" | null = null) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].isAlive()) {
				const channel = this.players[i].getPrivateChannel()

				if (pin === "period") {
					this.sendPeriodPin(channel, message)
				} else if (pin === "permanent") {
					this.sendPin(channel, message)
				} else {
					channel.send(message)
				}
				await auxils.delay(100)
			}
		}
	}

	cycle(): void {
		for (let i = expansions.length - 1; i >= 0; i--) {
			const cycle = expansions[i].scripts.cycle

			if (!cycle) {
				continue
			}

			cycle(this)
		}

		if (this.period % 2 === 0) {
			this.day()
		} else {
			this.night()
		}
	}

	day(): void {
		// Executed at the start of daytime

		if (this.game_start_message_sent == true) {
			this.createTrialVote()
		}

		if (this.config["game"]["mafia"]["night-only"]) {
			executable.misc.lockMafiaChat(this)
		} else {
			executable.misc.openMafiaChat(this)
			executable.misc.postMafiaPeriodicMessage(this)
		}

		executable.misc.openMainChats(this)
	}

	night(): void {
		// Executed at the start of nighttime

		// Lynch players
		executable.misc.openMafiaChat(this)
		executable.misc.postMafiaPeriodicMessage(this)

		if (!this.config["game"]["town"]["night-chat"]) {
			executable.misc.lockMainChats(this)
		} else {
			executable.misc.openMainChats(this)
		}
	}

	private async createPeriodPin(message: Message): Promise<boolean> {
		const log = this.getPeriodLog()

		const result = executable.misc.pinMessage(message)

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

	checkLynches(): void {
		// Find players who will be lynched

		let lynchable = []

		for (let i = 0; i < this.players.length; i++) {
			if (!this.players[i].isAlive()) {
				continue
			}

			const votes = this.players[i].countVotes()
			const required = this.getVotesRequired() - this.players[i].getVoteOffset()

			const top_voted_lynch =
				this.config["game"]["lynch"]["top-voted-lynch"] &&
				votes >= this.config["game"]["lynch"]["top-voted-lynch-minimum-votes"]

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
		const top_voted_lynch = this.config["game"]["lynch"]["top-voted-lynch"]

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
					!this.config["game"]["lynch"]["tied-random"]
				) {
					// Stop further lynch
					break
				}

				const success = this.lynch(target)

				if (success) {
					lynched.push(target)
				}

				lynchable.splice(0, 1)
			}
		}

		// Successful lynches go into lynched
		// Broadcast the lynches in the main channel
		executable.misc.broadcastMainLynch(this, lynched)
	}

	lynch(role: Player): boolean {
		const success = executable.misc.lynch(this, role)

		// Add lynch summary
		if (success) {
			this.silentKill(role, "__lynched__", "lynched")
		}
		return success
	}

	kill(
		role: Player,
		reason: string,
		secondary_reason?: string,
		broadcast_position_offset = 0,
		circumstances: Record<string, any> = {}
	): void {
		// Secondary reason is what the player sees
		// Can be used to mask death but show true
		// reason of death to the player killed
		this.silentKill(role, reason, secondary_reason, broadcast_position_offset, circumstances)

		if (this.getPeriodLog() && this.getPeriodLog().trial_vote) {
			this.clearAllVotesFromAndTo(role.identifier)
			this.reloadTrialVoteMessage()
			this.checkLynchHammer()
		}
	}

	silentKill(
		role: Player,
		reason: string,
		secondary_reason?: string,
		broadcast_position_offset = 0,
		circumstances: Record<string, any> = {}
	): void {
		// Work in progress, should remove emote
		/*
    if (this.getPeriodLog() && this.getPeriodLog().trial_vote) {
      executable.misc.removePlayerEmote(this, role.identifier);
    };
    */

		// Secondary reason is what the player sees
		// Can be used to mask death but show true
		// reason of death to the player killed
		this.execute("killed", {
			target: role.identifier,
			circumstances: circumstances,
		})
		executable.misc.kill(this, role)
		this.primeDeathMessages(role, reason, secondary_reason, broadcast_position_offset)
	}

	modkill(id: string): boolean {
		const role = this.getPlayerById(id)

		if (!role) {
			return false
		}
		if (role.hasPrivateChannel()) {
			role.getPrivateChannel().send(":exclamation: You have been removed from the game by a moderator.")
		}

		executable.admin.modkill(this, role)
		return true
	}

	primeDeathMessages(role: Player, reason: string, secondary?: string, broadcast_position_offset = 0): void {
		this.addDeathBroadcast(role, reason, broadcast_position_offset)

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

	enterDeathBroadcasts(offset = 0): void {
		// Enters in from log.death_broadcasts
		const log = this.getPeriodLog(offset)

		const registers = Array.from(log.death_broadcasts)

		registers.sort((a, b) => a.position_offset - b.position_offset)

		const unique: string[] = []

		for (let i = 0; i < registers.length; i++) {
			if (!unique.includes(registers[i].role)) {
				unique.push(registers[i].role)
			}
		}

		const cause_of_death_config = this.config["game"]["cause-of-death"]
		const exceptions = cause_of_death_config["exceptions"]

		// Inverted
		const hide_day = cause_of_death_config["hide-day"] && !this.isDay()
		const hide_night = cause_of_death_config["hide-night"] && this.isDay()

		unique.forEach((item) => {
			const role = this.getPlayerByIdentifier(item)
			if (!role) {
				this.logger.logError(new Error(`No player found with identifier ${item}`))
				return
			}

			const reasons = []
			registers
				.filter((register) => register.role === item)
				.forEach((register) => {
					let exempt = false

					// TODO: fix
					for (let k = 0; k < exceptions.length; k++) {
						if (register.reason.includes(exceptions[k])) {
							exempt = true
							break
						}
					}

					if (!(hide_day || hide_night) || exempt) {
						reasons.push(register.reason)
					}
				})

			if (reasons.length < 1) {
				reasons.push("found dead")
			}

			const reason = auxils.pettyFormat(reasons)

			const message = executable.misc.getDeathBroadcast(this, role, reason)

			this.addBroadcastSummary(message, offset)
		})

		this.uploadPublicRoleInformation(unique)
	}

	uploadPublicRoleInformation(role_identifiers: string[]): void {
		const display: Player[] = []

		if (!this.previously_uploaded_role_info) {
			this.previously_uploaded_role_info = []
		}

		for (let i = 0; i < role_identifiers.length; i++) {
			const player = this.getPlayerByIdentifier(role_identifiers[i])
			if (!player) {
				this.logger.logError(new Error(`Unable to find player by identifier ${role_identifiers[i]}`))
				continue
			}

			const flavour = this.getGameFlavour()
			const exception =
				this.previously_uploaded_role_info.includes(player.role_identifier) &&
				flavour &&
				flavour.info["do-not-repost-duplicate-cards"] === true

			if (!player.misc.role_cleaned && !exception) {
				display.push(player)
			}

			if (!this.previously_uploaded_role_info.includes(player.role_identifier)) {
				this.previously_uploaded_role_info.push(player.role_identifier)
			}
		}

		executable.roles.uploadPublicRoleInformation(this, display)
	}

	private addDeathBroadcast(role: Player, reason: string, position_offset = 0) {
		const log = this.getPeriodLog()

		log.death_broadcasts.push({
			role: role.identifier,
			reason: reason,
			position_offset: position_offset,
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

	addMessages(roles: Player[], message: string): void {
		for (let i = 0; i < roles.length; i++) {
			this.addMessage(roles[i], message)
		}
	}

	getBroadcast(offset = 0, enter = false): string | undefined {
		if (enter) {
			this.enterDeathBroadcasts(offset)
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

			executable.misc.sendIndivMessage(this, messages[i].recipient, message)

			await auxils.delay(80)
		}
	}

	private clearPeriodPins() {
		// Clears the pinned messages in the period log

		const log = this.getPeriodLog()
		const pins = log.pins

		for (let i = 0; i < pins.length; i++) {
			const pin = pins[i]
			executable.misc.unpinMessage(this, pin.channel, pin.message)
		}
	}

	getGuildMember(id: Snowflake): GuildMember | null {
		const guild = this.getGuild()
		return guild.members.get(id) || null
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

		this.game_start_message_sent = true

		executable.misc.postGameStart(this)

		setTimeout(() => {
			this.createTrialVote()
		}, 1600)

		await Promise.all(cache)

		if (!this.isDay() && !this.config["game"]["town"]["night-chat"]) {
			executable.misc.lockMainChats(this)
		} else {
			executable.misc.openMainChats(this)
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
		// Check day night cycles, also used on referesh
		// Should not put post functions in here,
		// only administrative junk

		let trials = Math.max(
			this.config["game"]["minimum-trials"],
			Math.ceil(this.config["game"]["lynch-ratio-floored"] * this.getAlive())
		)

		// Clear fast forward votes
		this.fast_forward_votes = []

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

	addTrialVoteOperation(operation: OperationType, amount: number): void {
		const allowed = ["addition", "subtraction", "multiplication", "division", "modulo", "max", "min"]

		if (!allowed.includes(operation)) {
			const err = new Error("Operation " + operation + " is not allowed!")
			throw err
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

	getVotesRequired(): number {
		const alive = this.getAlive()

		// Floored of alive
		//return 1;
		return Math.max(this.config["game"]["minimum-lynch-votes"], Math.floor(alive / 2) + 1)
	}

	getNoLynchVotesRequired(): number {
		const alive = this.getAlive()

		// Ceiled of alive
		return Math.max(this.config["game"]["minimum-nolynch-votes"], Math.ceil(alive / 2))
	}

	getDiscordUser(alphabet: string): User | null {
		const player = this.getPlayerByAlphabet(alphabet)
		if (!player) {
			return null
		}

		return this.client.users.get(player.id) || null
	}

	setPresence(presence: PresenceData): void {
		executable.misc.updatePresence(this, presence)
	}

	getFormattedDay(offset = 0): string {
		const period = this.period + offset

		const numeral = Math.ceil(0.5 * period)

		const flavour = this.getGameFlavour()

		if (flavour && flavour.info["step-names"]) {
			const step_names = flavour.info["step-names"]
			const step = this.getStep() + offset

			const index = step % step_names.length

			return step_names[index] + " " + numeral
		}

		if (period % 2 === 0) {
			return "Day " + numeral
		} else {
			return "Night " + numeral
		}
	}

	save(silent?: boolean): void {
		this.timer?.save(silent)
	}

	tentativeSave(silent?: boolean, bufferTime?: number): void {
		this.timer?.tentativeSave(silent, bufferTime)
	}

	format(string: string): string {
		return executable.misc.__formatter(this, string)
	}

	reinstantiate(timer: Timer, players: Player[]): void {
		this.timer = timer
		this.players = players

		if (this.game_config_override) {
			this.config.game = auxils.objectOverride(this.config.game, this.game_config_override)
		} else {
			this.game_config_override = {}
		}

		// Check role/attribute incompatibility
		let incompatible: PlayerProperty[] = []
		for (let i = 0; i < players.length; i++) {
			incompatible = incompatible.concat(players[i].verifyProperties())
		}

		if (this.flavour_identifier && !flavours[this.flavour_identifier]) {
			incompatible = incompatible.concat({
				type: "flavour",
				identifier: this.flavour_identifier,
			})
		}

		if (incompatible.length > 0) {
			const errors = [
				{
					type: "role",
					items: auxils.getUniqueArray(incompatible.filter((x) => x.type === "role").map((x) => x.identifier)),
				},
				{
					type: "attribute",
					items: auxils.getUniqueArray(incompatible.filter((x) => x.type === "attribute").map((x) => x.identifier)),
				},
				{
					type: "flavour",
					items: auxils.getUniqueArray(incompatible.filter((x) => x.type === "flavour").map((x) => x.identifier)),
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

		players.forEach((player) => player.reinstantiate(this))

		if (this.players_tracked !== players.length) {
			this.logger.log(4, "The players' save files have been removed/deleted!")
		}

		this.players_tracked = players.length

		this.actions.reinstantiate(this)
		this.instantiateTrialVoteCollector()
	}

	addAction<T>(identifier: string, triggers: Trigger[], options: ActionOptions<T>, rearrange = true): Actionable<T> {
		// Inherits
		return this.actions.add(identifier, triggers, options, rearrange)
	}

	execute(type: Trigger, params: ExecutionParams, check_expiries = true): void {
		this.actions.execute(type, params, check_expiries)
	}

	getPlayerMatch(name: string): { score: number; player: Player } {
		// Check if name is alphabet

		let player = this.getPlayerByAlphabet(name)
		let score: number

		if (player === null) {
			const guild = this.getGuild()
			const distances = []

			for (let i = 0; i < this.players.length; i++) {
				const member = guild.members.get(this.players[i].id)

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

	find<K extends keyof Player>(key: K, value: Player[K]): Player | null
	find(condition: PlayerPredicate): Player | null

	find(key: keyof Player | PlayerPredicate, value?: any): Player | null {
		if (typeof key === "function") {
			return this.players.find(key) || null
		}
		return this.players.find((player) => player[key] === value) || null
	}

	findAll<K extends keyof Player>(key: K, value: Player[K]): Player[]
	findAll(condition: PlayerPredicate): Player[]

	findAll(key: keyof Player | PlayerPredicate, value?: any): Player[] {
		if (typeof key === "function") {
			return this.players.filter(key)
		}
		return this.players.filter((player) => player[key] === value)
	}

	exists<K extends keyof Player>(key: K, value: Player[K]): boolean
	exists(condition: PlayerPredicate): boolean
	exists(key: keyof Player | PlayerPredicate, value?: any): boolean {
		if (typeof key === "function") {
			return !!this.players.find(key)
		}
		return !!this.players.find((player) => player[key] === value)
	}

	checkWin(): void {
		executable.wins.checkWin(this)
	}

	endGame(): void {
		this.logger.log(2, "Game ended!")

		executable.conclusion.endGame(this)

		this.getMainChannel().send(this.config["messages"]["game-over"])

		this.clearTrialVoteReactions()

		// End the game
		this.state = GameState.ENDED
		this.timer?.updatePresence()
	}

	getGuild(): Guild {
		return getGuild(this.client)
	}

	postWinLog(): void {
		if (this.win_log) {
			executable.misc.postWinLog(this, this.win_log.faction, this.win_log.caption)
		} else {
			this.logger.log(3, "The win log has not been primed!")
		}
	}

	primeWinLog(faction: string, caption: string): void {
		this.win_log = { faction: faction, caption: caption }
	}

	getRolesChannel(): TextChannel {
		return this.findTextChannel(this.config["channels"]["roles"])
	}

	getLogChannel(): TextChannel {
		return this.findTextChannel(this.config["channels"]["log"])
	}

	getMainChannel(): TextChannel {
		return this.findTextChannel(this.config["channels"]["main"])
	}

	getWhisperLogChannel(): TextChannel {
		return this.findTextChannel(this.config["channels"]["whisper-log"])
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

	setWin(role: Player): void {
		executable.misc.postWinMessage(role)
		role.setWin()
	}

	setWins(roles: Player[]): void {
		for (let i = 0; i < roles.length; i++) {
			this.setWin(roles[i])
		}
	}

	async createPrivateChannel(channelName: string, permissions: RolePermission[]): Promise<TextChannel> {
		return (await executable.misc.createPrivateChannel(this, channelName, permissions)) as TextChannel
	}

	postPrimeLog(): void {
		executable.misc.postPrimeMessage(this)
	}

	postDelayNotice(): void {
		executable.misc.postDelayNotice(this)
	}

	substitute(id1: string, id2: string, detailed_substitution: boolean): Promise<void> {
		return executable.admin.substitute(this, id1, id2, detailed_substitution)
	}

	clearPreemptiveVotes(): void {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].clearPreemptiveVotes()
		}
	}

	loadPreemptiveVotes(clear_cache = true): void {
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
					this.toggleVote(player, current)

					successes.push(current)

					if (successes.length >= amount) {
						break
					}
				}
			}

			if (successes.length > 0) {
				executable.misc.sendPreemptMessage(player, successes)
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

	addFastForwardVote(identifier: string): void {
		if (this.votedFastForward(identifier)) {
			return
		}

		this.fast_forward_votes.push(identifier)
	}

	removeFastForwardVote(identifier: string): void {
		if (!this.votedFastForward(identifier)) {
			return
		}
		this.fast_forward_votes = this.fast_forward_votes.filter((x) => x !== identifier)
	}

	votedFastForward(identifier: string): boolean {
		return this.fast_forward_votes.includes(identifier)
	}

	checkFastForward(): void {
		// Wrt to the configuration

		const alive_count = this.getAlive()

		const minimum = Math.ceil(alive_count * this.config["game"]["fast-forwarding"]["ratio"])

		let ff_votes = this.fast_forward_votes

		// Confirm that all players are alive
		ff_votes = ff_votes.filter((x) => this.getPlayerByIdentifier(x)?.isAlive())

		const ratio = ff_votes.length / alive_count
		const percentage = Math.round(ratio * 1000) / 10

		if (ff_votes.length >= minimum) {
			// Fast forward the game
			this.addBroadcastSummary(
				"The game has been **fastforwarded** with __" + percentage + "%__ of alive players voting for such last cycle."
			)
			this.fastforward()
		}
	}

	checkRole(condition: string | PlayerPredicate): boolean {
		if (typeof condition === "function") {
			// Check
			return this.exists(condition)
		} else if (typeof condition === "string") {
			condition = condition.toLowerCase()

			// Check separately
			const cond1 = this.exists((x) => x.isAlive() && x.role_identifier === condition)
			const cond2 = this.exists((x) => x.isAlive() && x.expandedRole().alignment === condition)
			const cond3 = this.exists((x) => x.isAlive() && x.expandedRole().class === condition)

			let cond4 = false

			if (condition.includes("-")) {
				const parts = condition.split("-")
				cond4 = this.exists(
					(x) => x.isAlive() && x.expandedRole().alignment === parts[0] && x.expandedRole().class === parts[1]
				)
			}

			return cond1 || cond2 || cond3 || cond4
		} else {
			return false
		}
	}

	checkRoles(...conditions: string[]): boolean {
		let ret = false

		for (let i = 0; i < conditions.length; i++) {
			ret = ret || this.checkRole(conditions[i])
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

	addNoLynchVote(identifier: string, magnitude: number): void {
		const no_lynch_vote = this.getPeriodLog()["no_lynch_vote"]

		no_lynch_vote.push({ identifier: identifier, magnitude: magnitude })
		this.execute("vote", { target: "nl", voter: identifier })
	}

	clearNoLynchVotesBy(identifier: string): boolean {
		const no_lynch_vote = this.getPeriodLog()["no_lynch_vote"]

		let cleared = false

		for (let i = no_lynch_vote.length - 1; i >= 0; i--) {
			if (no_lynch_vote[i].identifier === identifier) {
				no_lynch_vote.splice(i, 1)
				cleared = true
			}
		}

		if (cleared) {
			this.execute("unvote", { target: "nl", voter: identifier })
		}

		return cleared
	}

	clearNoLynchVotes(): void {
		this.getPeriodLog()["no_lynch_vote"] = []
	}

	isVotingNoLynch(identifier: string): boolean {
		return this.getNoLynchVoters().includes(identifier)
	}

	hammerActive(): boolean {
		const trials_available = this.getTrialsAvailable()

		return this.config["game"]["lynch"]["allow-hammer"] && trials_available < 2
	}

	getTrialsAvailable(): number {
		const period_log = this.getPeriodLog()
		if (period_log) {
			return period_log["trials"]
		}
		return Math.max(
			this.config["game"]["minimum-trials"],
			Math.ceil(this.config["game"]["lynch-ratio-floored"] * this.getAlive())
		)
	}

	clearAllVotesOn(identifier: string): void {
		const player = this.getPlayerByIdentifier(identifier)
		if (player) {
			player.clearVotes()
		}
	}

	clearAllVotesFromAndTo(identifier: string): void {
		// Stops votes to and from player
		this.clearNoLynchVotesBy(identifier)
		this.clearAllVotesBy(identifier)
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

	getAPI(): typeof lcn {
		return lcn
	}
}

export default Game
