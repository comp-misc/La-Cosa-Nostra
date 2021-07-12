import Player, { PlayerAttribute } from "./game_templates/Player"
import { CommandType, RoleCommand } from "../commands/CommandType"
import { RoleRoutine } from "../role"

export interface DisplayField {
	name: string
	description: string
}

export interface ModularDetails {
	cluster: string
	"display-field"?: DisplayField[]
}

export interface AttributeInfo {
	name: string
	modular: boolean
	"modular-details"?: ModularDetails
}

export interface Attribute {
	directory: string
	attribute: AttributeInfo
	start?: AttributeStart
	routines?: RoleRoutine
	commands: CommandType<"role", RoleCommand>[]
}

export interface AttributeStart {
	(player: Player, attribute: PlayerAttribute, isGameStart: boolean): void | Promise<void>
	DO_NOT_RUN_ON_GAME_START?: boolean
	DO_NOT_RUN_ON_ADDITION?: boolean
}
