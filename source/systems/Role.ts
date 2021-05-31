import { CommandProperties, RoleCommand } from "../commands/CommandType"
import Player, { PlayerStats } from "./game_templates/Player"

export type Alignment = "town" | "mafia" | "3p" | "undead" | string
export type RoleClass = "unclassified" | "support" | "killing" | "investigative" | string
export type WinConditionName = "town" | "mafia" | "serial_killer" | string

export interface RoleProperties {
	"role-name": string
	alignment: Alignment
	class: RoleClass
	investigation?: string[]
	stats: PlayerStats
	"see-mafia-chat": boolean
	"reveal-role-on-interrogation": boolean
	"win-condition": WinConditionName
	"has-actions": boolean

	abilities?: string[]
	attributes?: string[]
	credits?: string[]
	thumbnail?: string
}

/**
 * @deprecated
 */
export interface RoleInfo {
	thumbnail?: string
	abilities?: string[]
	attributes?: string[]
	credits?: string[]
}

export interface RoleConstructor<T extends ProgrammableRole<S>, S> {
	new (config: S): T
}

export interface RoleMetadata<T extends ProgrammableRole<S>, S> {
	identifier: string
	expansion: string
	directory: string
	roleClass: RoleConstructor<T, S>
	isLegacy: boolean
}

export interface Role<T extends ProgrammableRole<S> = any, S = unknown> extends RoleMetadata<T, S> {
	role: T
}

export interface RoutineProperties {
	ALLOW_DEAD: boolean
	ALLOW_NIGHT: boolean
	ALLOW_DAY: boolean
}

export type RoleStart = (player: Player) => void | Promise<void>

export interface RoleRoutine extends RoutineProperties {
	(player: Player): void
}

export const createRoutines = (
	func: (player: Player) => void | Promise<void>,
	properties: RoutineProperties
): RoleRoutine => {
	const routine: RoleRoutine = (player: Player) => func(player)
	routine.ALLOW_DAY = properties.ALLOW_DAY
	routine.ALLOW_NIGHT = properties.ALLOW_NIGHT
	routine.ALLOW_DEAD = properties.ALLOW_DEAD
	return routine
}

export interface ProgrammableRole<T> {
	readonly config: T
	readonly properties: RoleProperties

	readonly commands: CommandProperties<RoleCommand>[]

	readonly routineProperties: RoutineProperties

	readonly displayName?: string

	getDescription(): string

	/**
	 * Generate the role card
	 */
	getRoleCard?: () => Promise<Buffer | undefined>

	onStart(player: Player): void | Promise<void>

	onRoutines(player: Player): void | Promise<void>
}
