import crypto from "crypto"
import { Client, Guild, GuildMember, Snowflake, TextChannel, User } from "discord.js"
import getLogger from "../../getLogger"
import alpha_table from "../alpha_table"
import attributes from "../attributes"
import auxils from "../auxils"
import executable from "../executable"
import { RoleRoutine } from "../Role"
import Game, { VoteMeta } from "./Game"
import Logger from "./Logger"
import { ExpandedRole } from "../executable/roles/getRole"
import getGuild from "../../getGuild"

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

export interface PlayerAttribute {
	identifier: string
	expiry: number
	tags: Record<string, any>
	attribute: Record<string, any>
}

export interface PlayerStats {
	"basic-defense": number
	"roleblock-immunity": number
	"detection-immunity": number
	"control-immunity": number
	"redirection-immunity": number
	"kidnap-immunity": number
	priority: number
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
	readonly status: PlayerStatus
	id: string
	alphabet: keyof typeof alpha_table
	identifier: PlayerIdentifier
	role_identifier: string
	game: Game | undefined
	votes: VoteMeta[]
	initial_role_identifier: string[]
	permanent_stats: PlayerStats
	game_stats: PlayerStats
	pre_emptive: string[]
	will?: string
	precedent_will?: string
	readonly logger: Logger
	intro_messages: string[]
	display_role: string | null | undefined
	channel: ChannelMeta | undefined
	base_flavour_identifier?: string
	special_channels: ChannelMeta[]
	see_mafia_chat: boolean
	flavour_role: string | null
	display_secondary: string | undefined
	attributes: PlayerAttribute[]
	misc: Record<string, any>
	role: ExpandedRole | undefined
	tampered_load_times?: Date[]

	modular_log?: string[]
	modular_success_log?: string[]

	ffstatus: FFStatus

	constructor(client: Client) {
		this.client = client
		this.logger = getLogger()
		this.status = {
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
		this.id = ""
		this.votes = []
		this.identifier = ""
		this.alphabet = "nl"
		this.role_identifier = ""
		this.initial_role_identifier = []
		this.ffstatus = FFStatus.OFF

		this.channel = undefined
		this.see_mafia_chat = false
		this.special_channels = []
		this.pre_emptive = []
		this.votes = []
		this.intro_messages = []

		// 3x stats - game_stats, permanent_stats, role.stats
		this.misc = {}
		this.will = undefined
		this.display_role = undefined
		this.display_secondary = undefined
		this.base_flavour_identifier = undefined
		this.flavour_role = null
		this.permanent_stats = {
			"basic-defense": 0,
			"roleblock-immunity": 0,
			"detection-immunity": 0,
			"control-immunity": 0,
			"redirection-immunity": 0,
			"kidnap-immunity": 0,
			priority: 0,
			"vote-offset": 0,
			"vote-magnitude": 0,
		}
		this.game_stats = this.permanent_stats
		this.attributes = []
	}

	init(id: string, alphabet: keyof typeof alpha_table, role_identifier: string): this {
		this.id = id
		this.alphabet = alphabet
		this.role_identifier = role_identifier
		this.initial_role_identifier = [role_identifier]

		this.identifier = crypto.randomBytes(8).toString("hex")

		const role = this.instantiateRole()

		this.see_mafia_chat = role["see-mafia-chat"]
		this.permanent_stats = {
			"basic-defense": 0,
			"roleblock-immunity": 0,
			"detection-immunity": 0,
			"control-immunity": 0,
			"redirection-immunity": 0,
			"kidnap-immunity": 0,
			priority: 0,
			"vote-offset": 0,
			"vote-magnitude": role.stats["vote-magnitude"],
		}

		// Initialise stats
		// A more than value will cause
		// the action to fire
		this.game_stats = {
			"basic-defense": 0,
			"roleblock-immunity": 0,
			"detection-immunity": 0,
			"control-immunity": 0,
			"redirection-immunity": 0,
			"kidnap-immunity": 0,
			priority: 0,
			"vote-offset": 0,
			"vote-magnitude": this.permanent_stats["vote-magnitude"],
		}
		this.attributes = []
		// Attributes
		return this
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

	voteAgainst(identifier: string, magnitude = 1): void {
		// x votes against this player
		this.votes.push({ identifier: identifier, magnitude: magnitude })
		this.getGame().execute("vote", { target: identifier, voter: this.identifier })
	}

	toggleVotes(identifier: string, magnitude = 1): boolean {
		if (this.isVotedAgainstBy(identifier)) {
			this.clearVotesBy(identifier)
			return false
		} else {
			this.voteAgainst(identifier, magnitude)
			return true
		}
	}

	clearVotesBy(identifier: string): boolean {
		for (let i = 0; i < this.votes.length; i++) {
			if (this.votes[i].identifier === identifier) {
				this.votes.splice(i, 1)
				this.getGame().execute("unvote", {
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
		return auxils.operations.addition(...this.votes.map((v) => v.magnitude))
	}

	getVoteOffset(): number {
		return this.getStat("vote-offset", (a, b) => a + b)
	}

	postGameInit(): void {
		this.instantiateFlavour()
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
			priority: 0,
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
			modifier = auxils.operations.addition
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
		return channel as TextChannel
	}

	getRoleStats(): PlayerStats {
		return this.getRoleOrThrow().stats
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
		const c = this.getRoleOrThrow().stats[key]

		return modifier(modifier(a, b), c)
	}

	getStatus(key: keyof PlayerStatus): boolean {
		return this.status[key]
	}

	setStatus(key: keyof PlayerStatus, value: boolean): void {
		this.status[key] = value
	}

	setWill(will: string | undefined): void {
		this.will = will
	}

	setPrecedentWill(will: string | undefined): void {
		this.precedent_will = will
	}

	getWill(): string | undefined {
		const will = this.precedent_will

		if (will === null) {
			return undefined
		}

		return this.precedent_will || this.will
	}

	getTrueWill(): string | undefined {
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
		const role = this.getRoleOrThrow()
		if (role.start) {
			try {
				await role.start(this)
			} catch (err) {
				this.logger.log(
					4,
					"Role start script error with player %s (%s) [%s]",
					this.identifier,
					this.getDisplayName(),
					this.role_identifier
				)
				this.logger.logError(err)
			}
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

	getDisplayRole(append_true_role = true): string {
		// Show display role first

		return this.display_role || this.getTrueFlavourRole(append_true_role)
	}

	getTrueFlavourRole(append_true_role = true): string {
		// Show display role first

		let flavour_role = this.flavour_role

		const flavour = this.getGame().getGameFlavour()
		const role = this.getRoleOrThrow()

		if (flavour && flavour_role) {
			const display_extra = flavour.info["display-role-equivalent-on-death"]

			if (display_extra && flavour_role !== role["role-name"] && append_true_role) {
				flavour_role += " (" + (this.display_secondary || role["role-name"]) + ")"
			}
		}

		return flavour_role || role["role-name"]
	}

	setDisplayRole(role_name: string): void {
		this.display_role = role_name
	}

	clearDisplayRole(): void {
		this.display_role = null
	}

	getRole(): string {
		// Give true role
		return this.display_secondary || this.getRoleOrThrow()["role-name"]
	}

	getInitialRole(append_true_role = true): string {
		let flavour_role = this.flavour_role

		const flavour = this.getGame().getGameFlavour()

		const initialRole = executable.roles.getRole(this.initial_role_identifier[0])
		if (!initialRole) {
			throw new Error(`No initial role found with id ${this.initial_role_identifier[0]}`)
		}

		const initial = initialRole["role-name"]

		if (flavour && flavour_role) {
			if (flavour_role !== initial && append_true_role) {
				flavour_role += " (" + (this.display_secondary || initial) + ")"
			}
		}

		return flavour_role || initial || this.getRoleOrThrow()["role-name"]
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

	reinstantiate(game: Game): void {
		this.setGame(game)
		this.instantiateRole()
	}

	verifyProperties(): PlayerProperty[] {
		const incompatible = []

		const role = executable.roles.getRole(this.role_identifier, true)

		if (!role) {
			incompatible.push({ type: "role", identifier: this.role_identifier })
		}

		for (let i = 0; i < this.attributes.length; i++) {
			const identifier = this.attributes[i].identifier

			if (!attributes[identifier]) {
				incompatible.push({ type: "attribute", identifier: identifier })
			}
		}

		return incompatible
	}

	setGame(game: Game): void {
		this.game = game
	}

	isAlive(): boolean {
		return this.getStatus("alive")
	}

	changeRole(role_identifier: string, change_vote_magnitude_stat = false, rerun_start = true): void {
		this.role_identifier = role_identifier
		this.initial_role_identifier.push(role_identifier)

		this.instantiateRole()

		this.see_mafia_chat = this.see_mafia_chat || this.getRoleOrThrow()["see-mafia-chat"]

		if (change_vote_magnitude_stat) {
			const current_magnitude = this.getRoleStats()["vote-magnitude"]
			this.setPermanentStat("vote-magnitude", current_magnitude, "set")
		}

		const role = this.getRoleOrThrow()
		if (rerun_start && role.start) {
			role.start(this)
		}
	}

	instantiateRole(): ExpandedRole {
		const role = executable.roles.getRole(this.role_identifier)
		if (!role) {
			throw new Error(`No role found by id ${this.role_identifier}`)
		}
		this.role = role

		if (!this.role.tags) {
			this.role.tags = []
		}
		if (role["has-actions"] || role["has-actions"] === undefined) {
			this.ffstatus = FFStatus.OFF
		}
		return role
	}

	instantiateFlavour(): void {
		const flavour = this.getGame().getGameFlavour()

		if (!flavour) {
			return
		}

		// Base flavour identifier to override
		const identifier = this.base_flavour_identifier || this.role_identifier

		// Open identifier
		const current = flavour.roles[identifier]

		if (!current) {
			// Flavour role not defined
			this.flavour_role = null
			return
		}

		const assigned = this.getGame().findAll((x) => x.role_identifier === identifier && !x.flavour_role)

		const index = assigned.length % current.length

		// Roles is an array
		// Count number of roles assigned before
		this.flavour_role = current[index].name

		this.logger.log(1, "Flavour: %s, Role: %s", this.flavour_role, this.role_identifier)
	}

	isSame(player: Player): boolean {
		// Compare identifiers
		return this.identifier === player.identifier
	}

	async __routines(): Promise<void> {
		this.resetTemporaryStats()

		this.checkAttributeExpires()

		const role = this.getRoleOrThrow()
		if (role.routine) {
			try {
				await role.routine(this)
			} catch (e) {
				this.logger.logError(e)
			}
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
		return this.status["canWin"]
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
			identifier: attribute,
			expiry: expiry,
			tags: tags,
			attribute: playerAttribute,
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

	setBaseFlavourIdentifier(identifier: string): void {
		this.base_flavour_identifier = identifier
	}

	setDisplaySecondary(identifier: string): void {
		this.display_secondary = identifier
	}

	getGame(): Game {
		const game = this.game
		if (!game) {
			throw new Error("No game defined")
		}
		return game
	}

	getRoleOrThrow(): ExpandedRole {
		const role = this.role
		if (!role) {
			throw new Error("No role defined")
		}
		return role
	}

	getGuild(): Guild {
		return getGuild(this.client)
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
