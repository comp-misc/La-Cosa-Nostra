import Player, { PlayerAttribute } from "./game_templates/Player"
import { RoleRoutine } from "./Role"

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
}

export interface AttributeStart {
	//TODO What is this boolean used to indicate?
	(player: Player, attribute: PlayerAttribute, boolean: boolean): void | Promise<void>
	DO_NOT_RUN_ON_GAME_START?: boolean
	DO_NOT_RUN_ON_ADDITION?: boolean
}
