import { Command } from "./commands/CommandType"
import Lcn from "./lcn"
import { LcnConfig, PlayingConfig } from "./LcnConfig"
import { Version } from "./Version"
import Game from "./systems/game_templates/Game"

export type ExpansionType = "Setup" | "Utility" | "Commands" | "Expansion"

export interface ExpansionOverrides {
	flavours?: string[]
	role_win_conditions?: string[]
	roles?: string[]
	attributes?: string[]
}

export interface ExpansionInfo {
	name: string
	type: ExpansionType
	description: string
	link?: string
	authors: string[]
	overrides?: ExpansionOverrides
	dependencies?: string[]
	compatibility?: string
}

export type StartScript = (config: LcnConfig) => LcnConfig
type GameScript = (game: Game) => void | Promise<void>

export type GameStartScript = GameScript
export type GameSecondaryStartScript = GameScript
export type GameAssignScript = (config: PlayingConfig) => PlayingConfig
export type GameInitScript = GameScript
export type CycleScript = GameScript
export type InitScript = (lcn: typeof Lcn, version: Version) => void

export interface ExpansionScripts {
	/** Handles configuration on LOAD */
	start?: StartScript

	/** Runs script when a game is started */
	game_start?: GameStartScript

	/** Runs script when a game is started, after all chats are assigned */
	game_secondary_start?: GameSecondaryStartScript

	/** Runs script BEFORE a prime (usually to determine setup, return config) */
	game_assign?: GameAssignScript

	/** Runs script on initialisation of the game object (same as prime, but before Mafia chat creation) */
	game_init?: GameInitScript

	/** Runs script every cycle */
	cycle?: CycleScript

	/** Runs after systems have been loaded */
	init?: InitScript
}

export interface ExpansionAdditions {
	assets: string[]
	roles: string[]
	flavours: string[]
	role_win_conditions: string[]
	attributes: string[]
}

export interface Expansion {
	expansion_directory: string
	identifier: string
	expansion: ExpansionInfo
	additions: ExpansionAdditions
	scripts: ExpansionScripts
	commands: Command[]
}
