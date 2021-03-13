import { Client, Message } from "discord.js"
import { LcnConfig } from "../LcnConfig"
import Game from "../systems/game_templates/Game"
import Player from "../systems/game_templates/Player"

export interface GameCommand {
	(game: Game, message: Message, params: string[]): void
	ALLOW_PREGAME: boolean
	ALLOW_GAME: boolean
	ALLOW_POSTGAME: boolean
}
export interface RoleCommand {
	(game: Game, message: Message, params: string[], player: Player): void
	ALLOW_NONSPECIFIC: boolean
	PRIVATE_ONLY: boolean
	DEAD_CANNOT_USE: boolean
	ALIVE_CANNOT_USE: boolean
	DISALLOW_DAY: boolean
	DISALLOW_NIGHT: boolean
	role?: string
}
export type AdminCommand = (message: Message, params: string[], config: LcnConfig) => void
export type UnaffiliatedCommand = (message: Message, params: string[], config: LcnConfig) => void
export type ConsoleCommand = (client: Client, config: LcnConfig, params: string[]) => void

export interface CommandType<T, S> extends CommandProperties<S> {
	type: T
}

export type Command =
	| CommandType<"game", GameCommand>
	| CommandType<"role", RoleCommand>
	| CommandType<"admin", AdminCommand>
	| CommandType<"unaffiliated", UnaffiliatedCommand>
	| CommandType<"console", ConsoleCommand>

export interface CommandProperties<T> {
	name: string
	description: string
	command: T
	aliases?: string[]
	usage?: string
}
