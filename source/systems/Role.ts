import Player, { PlayerStats } from "./game_templates/Player"
import { CommandType, RoleCommand } from "../commands/CommandType"

export type Alignment = "town" | "mafia" | "neutral" | "undead" | string
export type RoleClass = "unclassified" | "support" | "killing" | "investigative" | string
export type WinConditionName = "town" | "mafia" | "serial_kiler" | string

export interface RoleProperties {
	"role-name": string
	alignment: Alignment
	class: RoleClass
	investigation: string[]
	tags: string[]
	stats: PlayerStats
	"see-mafia-chat": boolean
	"reveal-role-on-interrogation": boolean
	"win-condition": WinConditionName
	"has-actions": boolean

	// I can't find this used anywhere
	//"secondary-roles": string[] | null
}

export interface RoleInfo {
	thumbnail?: string
	abilities: string[]
	attributes: string[]
	credits?: string[]
}

export interface Role {
	directory: string
	description: string
	role: RoleProperties
	info: RoleInfo
	routine?: RoleRoutine
	start?: RoleStart
	role_card?: Promise<Buffer>
	commands: CommandType<"role", RoleCommand>[]
}

export interface RoleRoutine {
	(player: Player): void
	ALLOW_DEAD: boolean
	ALLOW_NIGHT: boolean
	ALLOW_DAY: boolean
}

export type RoleStart = (player: Player) => void
