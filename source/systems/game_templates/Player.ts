import { Client, Guild, GuildMember, Snowflake, TextChannel, User } from "discord.js"
import operations from "../../auxils/operations"
import getGuild from "../../getGuild"
import getLogger from "../../getLogger"
import alpha_table from "../alpha_table"
import { Attribute } from "../Attribute"
import attributes from "../attributes"
import executable from "../executable"
import { createRoutines, Role, RoleRoutine } from "../Role"
import win_conditions from "../win_conditions"
import Game, { VoteMeta } from "./Game"
import Logger from "./Logger"
import PlayerRole from "./PlayerRole"

type StatModifier = ((a: number, b: number) => number) | "set" | undefined

export interface PlayerProperty {
	type: string
	identifier: string
}

export interface PlayerStatus {
	alive: boolean
	lynchProof: boolean
	roleblocked: boolean
	controlled: boolean
	silenced: boolean
	kidnapped: boolean
	voteBlocked: boolean
	won: boolean
	canWin: boolean
}

interface ChannelMeta {
	id: Snowflake
	name: string
	created_at: Date
}

export interface PlayerAttribute extends Attribute {
	identifier: string
	expiry: number
	tags: Record<string, any>
}

export interface PlayerStats {
	"basic-defense": number
	"roleblock-immunity": number
	"detection-immunity": number
	"control-immunity": number
	"redirection-immunity": number
	"kidnap-immunity": number
	"vote-offset": number
	"vote-magnitude": number
}

export enum FFStatus {
	AUTO = "auto",
	ON = "on",
	OFF = "off",
}

export type PlayerIdentifier = string

class Player {
	private readonly client: Client
	private readonly game: Game

	readonly status: PlayerStatus = {
		alive: true,
		lynchProof: false,

		roleblocked: false,
		controlled: false,
		silenced: false,
		kidnapped: false,
		voteBlocked: false,

		won: false,
		canWin: true,
	}
	id: string
	readonly identifier: string
	alphabet: keyof typeof alpha_table
	votes: VoteMeta[] = []
	permanent_stats: PlayerStats
	game_stats: PlayerStats
	pre_emptive: string[] = []
	will: string | null = null
	precedent_will: string | null = null
	intro_messages: string[] = []
	channel: ChannelMeta | undefined = undefined
	special_channels: ChannelMeta[] = []
	see_mafia_chat: boolean
	attributes: PlayerAttribute[] = []
	misc: Record<string, any> = {}
	role: PlayerRole
	tampered_load_times?: Date[]

	modular_log?: string[]
	modular_success_log?: string[]

	ffstatus: FFStatus

	previousRoles: PlayerRole[] = []

	constructor(game: Game, id: string, identifier: string, alphabet: keyof typeof alpha_table, role: Role) {
		this.game = game
		this.client = game.client
		this.id = id
		this.identifier = identifier
		this.alphabet = alphabet
		this.role = new PlayerRole(role, this)

		const roleProperties = this.role.properties
		if (roleProperties["has-actions"] || roleProperties["has-actions"] === undefined) {
			this.ffstatus = FFStatus.OFF
		} else {
			this.ffstatus = FFStatus.AUTO
		}

		this.see_mafia_chat = roleProperties["see-mafia-chat"]

		this.permanent_stats = {
			"basic-defense": 0,
			"roleblock-immunity": 0,
			"detection-immunity": 0,
			"control-immunity": 0,
			"redirection-immunity": 0,
			"kidnap-immunity": 0,
			"vote-offset": 0,
			"vote-magnitude": roleProperties.stats["vote-magnitude"],
		}
		this.game_stats = this.permanent_stats

		const winCon = win_conditions[this.role.properties["win-condition"]]
		if (!winCon) {
			throw new Error(
				`Unknown win condition '${this.role.properties["win-condition"]}' found for role ${role.identifier}`
			)
		}
	}

	isVotedAgainstBy(identifier: string): boolean {
		// Check if id is voting against player

		for (let i = 0; i < this.votes.length; i++) {
			if (this.votes[i].identifier === identifier) {
				return true
			}
		}

		return false
	}

	private async voteAgainst(identifier: string, magnitude = 1) {
		// x votes against this player
		this.votes.push({ identifier: identifier, magnitude: magnitude })
		await this.getGame().execute("vote", { target: identifier, voter: this.identifier })
	}

	async toggleVotes(identifier: string, magnitude = 1): Promise<boolean> {
		if (this.isVotedAgainstBy(identifier)) {
			await this.clearVotesBy(identifier)
			return false
		} else {
			await this.voteAgainst(identifier, magnitude)
			return true
		}
	}

	async clearVotesBy(identifier: string): Promise<boolean> {
		for (let i = 0; i < this.votes.length; i++) {
			if (this.votes[i].identifier === identifier) {
				this.votes.splice(i, 1)
				await this.getGame().execute("unvote", {
					target: identifier,
					voter: this.identifier,
				})
				return true
			}
		}
		return false
	}

	clearVotes(): void {
		this.votes = []
	}

	countVotes(): number {
		return operations.addition(...this.votes.map((v) => v.magnitude))
	}

	getVoteOffset(): number {
		return this.getStat("vote-offset", (a, b) => a + b)
	}

	addPreemptiveVote(identifier: string): void {
		this.pre_emptive.push(identifier)
	}

	clearPreemptiveVotes(runnable: ((player: Player) => boolean) | undefined = undefined): void {
		if (typeof runnable === "function") {
			for (let i = this.pre_emptive.length - 1; i >= 0; i--) {
				const identifier = this.pre_emptive[i]

				const player = this.getGame().getPlayerByIdentifier(identifier)
				if (player) {
					const outcome = runnable(player)

					if (outcome === true) {
						this.pre_emptive.splice(i, 1)
					}
				}
			}
		} else {
			this.pre_emptive = []
		}
	}

	getPreemtiveVotes(): string[] {
		return this.pre_emptive
	}

	resetTemporaryStats(): void {
		this.game_stats = {
			"basic-defense": 0,
			"roleblock-immunity": 0,
			"detection-immunity": 0,
			"control-immunity": 0,
			"redirection-immunity": 0,
			"kidnap-immunity": 0,
			"vote-offset": 0,
			"vote-magnitude": this.permanent_stats["vote-magnitude"],
		}

		this.setStatus("roleblocked", false)
		this.setStatus("controlled", false)
		this.setStatus("silenced", false)
		this.setStatus("kidnapped", false)
		this.setStatus("voteBlocked", false)
	}

	setGameStat(key: keyof PlayerStats, amount: number, modifier: StatModifier): number {
		if (modifier === "set") {
			modifier = () => amount
		}

		if (modifier === undefined) {
			modifier = operations.addition
		}

		const final = modifier(this.game_stats[key], amount)

		this.game_stats[key] = final
		return final
	}

	setPermanentStat(key: keyof PlayerStats, amount: number, modifier: StatModifier): number {
		let final: number
		if (modifier === "set") {
			final = amount
		} else {
			if (modifier === undefined) {
				modifier = (a, b) => a + b
			}
			final = modifier(this.permanent_stats[key], amount)
		}

		this.permanent_stats[key] = final
		return final
	}

	hasPrivateChannel(): boolean {
		return !!this.channel
	}

	getPrivateChannel(): TextChannel {
		if (!this.channel) {
			throw new Error(`No private channel defined for ${this.getDisplayName()}`)
		}
		const guild = this.getGuild()
		const channel = guild.channels.cache.get(this.channel.id)
		if (!channel) {
			throw new Error(
				`No discord channel found with id ${this.channel.id} (private channel for ${this.getDisplayName()})`
			)
		}
		if (!(channel instanceof TextChannel)) {
			throw new Error(`Private channel for ${this.getDisplayName()} is not a text channel`)
		}
		return channel
	}

	getRoleStats(): PlayerStats {
		return this.role.stats
	}

	getPermanentStats(): PlayerStats {
		return this.permanent_stats
	}

	getTemporaryStats(): PlayerStats {
		return this.game_stats
	}

	getVoteMagnitude(): number {
		return this.getTemporaryStats()["vote-magnitude"]
	}

	getStat(key: keyof PlayerStats, modifier: (a: number, b: number) => number = (a, b) => a + b): number {
		if (key === "vote-magnitude") {
			this.logger.logError(new Error("[Vote magnitude] get this number with Player.getVoteMagnitude()"))
			return this.getVoteMagnitude()
		}

		const a = this.game_stats[key]
		const b = this.permanent_stats[key]
		const c = this.role.stats[key]

		return modifier(modifier(a, b), c)
	}

	getStatus(key: keyof PlayerStatus): boolean {
		return this.status[key]
	}

	setStatus(key: keyof PlayerStatus, value: boolean): void {
		this.status[key] = value
	}

	setWill(will: string | null): void {
		this.will = will
	}

	setPrecedentWill(will: string | null): void {
		this.precedent_will = will
	}

	getWill(): string | null {
		const will = this.precedent_will

		if (will === null) {
			return null
		}

		return this.precedent_will || this.will
	}

	getTrueWill(): string | null {
		// Gets the vanilla will
		return this.will
	}

	getGuildMember(): GuildMember | undefined {
		const guild = this.getGuild()
		return guild.members.cache.get(this.id)
	}

	getDisplayName(): string {
		const member = this.getGuildMember()

		if (!member) {
			return "[" + this.alphabet + "/" + this.id + "] undef'd player"
		} else {
			return member.displayName
		}
	}

	lynchable(): boolean {
		// Set the player to be lynched

		// Future special functions may go here

		return true
	}

	kill(): void {
		this.status.alive = false
	}

	async start(): Promise<void> {
		const role = this.role
		try {
			await role.role.onStart(this)
		} catch (err) {
			this.logger.log(
				4,
				"Role start script error with player %s (%s) [%s]",
				this.identifier,
				this.getDisplayName(),
				this.role.identifier
			)
			this.logger.logError(err)
		}

		// Start attributes
		for (let i = 0; i < this.attributes.length; i++) {
			const attribute = attributes[this.attributes[i].identifier]

			if (attribute.start) {
				if (attribute.start.DO_NOT_RUN_ON_GAME_START === true) {
					return
				}

				try {
					// Define truestart synchronisation
					await attribute.start(this, this.attributes[i], true)
				} catch (err) {
					this.logger.log(
						4,
						"Attribute start script error with player %s (%s) [%s]",
						this.identifier,
						this.getDisplayName(),
						this.attributes[i].identifier
					)
					this.logger.logError(err)
				}
			}
		}

		await this.postIntro()
		await this.__routines()
	}

	private async postIntro() {
		// Post intro
		await executable.roles.postRoleIntroduction(this)
	}

	get initialRole(): PlayerRole {
		if (this.previousRoles.length === 0) {
			return this.role
		}
		return this.previousRoles[0]
	}

	assignChannel(channel: TextChannel): void {
		this.channel = {
			id: channel.id,
			name: channel.name,
			created_at: channel.createdAt,
		}
		this.addSpecialChannel(channel)
	}

	addSpecialChannel(channel: TextChannel): void {
		this.special_channels.push({
			id: channel.id,
			name: channel.name,
			created_at: channel.createdAt,
		})
	}

	removeSpecialChannel(channel: TextChannel | ChannelMeta | string): void {
		if (typeof channel === "string") {
			this.special_channels = this.special_channels.filter((x) => x.id !== channel)
		} else {
			this.special_channels = this.special_channels.filter((channel) => channel.id !== channel.id)
		}
	}

	getSpecialChannels(): ChannelMeta[] {
		return this.special_channels
	}

	verifyProperties(): PlayerProperty[] {
		const incompatible = []

		for (let i = 0; i < this.attributes.length; i++) {
			const identifier = this.attributes[i].identifier

			if (!attributes[identifier]) {
				incompatible.push({ type: "attribute", identifier: identifier })
			}
		}

		return incompatible
	}

	isAlive(): boolean {
		return this.getStatus("alive")
	}

	async changeRole(newRole: Role, change_vote_magnitude_stat = false, rerun_start = true): Promise<void> {
		this.previousRoles.push(this.role)
		this.role = new PlayerRole(newRole, this)

		this.see_mafia_chat = this.see_mafia_chat || this.role.properties["see-mafia-chat"]

		if (change_vote_magnitude_stat) {
			const current_magnitude = this.role.stats["vote-magnitude"]
			this.setPermanentStat("vote-magnitude", current_magnitude, "set")
		}

		if (rerun_start) {
			await this.role.role.onStart(this)
		}
	}

	isSame(player: Player): boolean {
		// Compare identifiers
		return this.identifier === player.identifier
	}

	async __routines(): Promise<void> {
		this.resetTemporaryStats()

		this.checkAttributeExpires()

		try {
			await this.executeRoutine(
				createRoutines((p) => this.role.role.onRoutines(p), this.role.role.routineProperties)
			)
		} catch (e) {
			this.logger.logError(e)
		}

		for (let i = 0; i < this.attributes.length; i++) {
			const runnable = attributes[this.attributes[i].identifier].routines
			try {
				if (runnable) {
					await this.executeRoutine(runnable)
				}
			} catch (err) {
				this.logger.logError(err)
			}
		}
	}

	private async executeRoutine(routine: RoleRoutine): Promise<void> {
		if (!routine) {
			return
		}

		// Check if dead
		if (!this.isAlive() && !routine.ALLOW_DEAD) {
			return
		}

		if (this.getGame().isDay() && !routine.ALLOW_DAY) {
			return
		}

		if (!this.getGame().isDay() && !routine.ALLOW_NIGHT) {
			return
		}

		try {
			return await routine(this)
		} catch (err) {
			this.logger.logError(err)
		}
	}

	setWin(): void {
		this.status.won = true
	}

	hasWon(): boolean {
		return this.status.won
	}

	canWin(): boolean {
		return this.status.canWin
	}

	addIntroMessage(message: string): void {
		this.intro_messages.push(message)
	}

	substitute(id: string): void {
		this.id = id
	}

	hasAttribute(attribute: string): boolean {
		return this.attributes.some((x) => x.identifier === attribute)
	}

	async addAttribute(attribute: string, expiry = Infinity, tags: Record<string, unknown> = {}): Promise<void> {
		const playerAttribute = attributes[attribute]
		if (!playerAttribute) {
			throw new Error(`Invalid attribute identifier ${attribute}!`)
		}

		const addable: PlayerAttribute = {
			...playerAttribute,
			identifier: attribute,
			expiry: expiry,
			tags: tags,
		}

		if (playerAttribute.start && this.game) {
			if (playerAttribute.start.DO_NOT_RUN_ON_ADDITION === true) {
				return
			}

			try {
				await playerAttribute.start(this, addable, false)
			} catch (err) {
				this.logger.log(
					4,
					"Attribute start script error with player %s (%s) [%s]",
					this.identifier,
					this.getDisplayName(),
					addable.identifier
				)
				this.logger.logError(err)
			}
		}

		this.attributes.push(addable)
	}

	checkAttributeExpires(): void {
		this.attributes.forEach((attribute) => {
			if (attribute.expiry !== Infinity) {
				attribute.expiry--
			}
		})
		this.attributes = this.attributes.filter((attribute) => attribute.expiry === Infinity || attribute.expiry > 0)
	}

	deleteAttributes(condition: (attribute: PlayerAttribute) => boolean): PlayerAttribute[] {
		const ret = []
		for (let i = this.attributes.length - 1; i >= 0; i--) {
			if (this.attributes[i] && condition(this.attributes[i])) {
				ret.push(this.attributes[i])
				this.attributes.splice(i, 1)
			}
		}
		return ret
	}

	deleteAttribute(condition: (attribute: PlayerAttribute) => boolean): PlayerAttribute | null {
		for (let i = this.attributes.length - 1; i >= 0; i--) {
			if (this.attributes[i] && condition(this.attributes[i])) {
				const ret = this.attributes[i]
				this.attributes.splice(i, 1)
				return ret
			}
		}
		return null
	}

	getDiscordUser(): User | null {
		return this.client.users.cache.get(this.id) || null
	}

	getGame(): Game {
		const game = this.game
		if (!game) {
			throw new Error("No game defined")
		}
		return game
	}

	getGuild(): Guild {
		return getGuild(this.client)
	}

	private get logger(): Logger {
		return getLogger()
	}

	async sendFFStatusMessage(): Promise<void> {
		if (!this.isAlive()) {
			return
		}
		const channel = this.getPrivateChannel()
		if (this.ffstatus === FFStatus.AUTO) {
			await channel.send(
				"Fast forwarding is set to auto. Use '!ff off' if you wish to disable automatic fast forwarding"
			)
		} else if (this.ffstatus === FFStatus.OFF) {
			await channel.send(
				"Please use `!ff on` once you have used all your night actions and are ready to skip the night"
			)
		}
	}
}

export default Player
