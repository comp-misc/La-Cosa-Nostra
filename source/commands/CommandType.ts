import { Client } from "discord.js"
import { LcnConfig } from "../LcnConfig"
import MemberMessage from "../MemberMessage"
import Game from "../systems/game_templates/Game"
import Player from "../systems/game_templates/Player"

export interface GameCommand {
	(game: Game, message: MemberMessage, params: string[]): void | Promise<void>
	ALLOW_PREGAME: boolean
	ALLOW_GAME: boolean
	ALLOW_POSTGAME: boolean
}

export interface RoleCommandAttributes {
	PRIVATE_ONLY: boolean
	DEAD_CANNOT_USE: boolean
	ALIVE_CANNOT_USE: boolean
	DISALLOW_DAY: boolean
	DISALLOW_NIGHT: boolean
	attribute?: string
}
export interface RoleCommand extends RoleCommandAttributes {
	(game: Game, message: MemberMessage, params: string[], player: Player): void | Promise<void>
}
export type AdminCommand = (message: MemberMessage, params: string[], config: LcnConfig) => void | Promise<void>
export type UnaffiliatedCommand = (message: MemberMessage, params: string[], config: LcnConfig) => void | Promise<void>
export type ConsoleCommand = (client: Client, config: LcnConfig, params: string[]) => void | Promise<void>

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

export class CommandUsageError extends Error {
	constructor(message?: string) {
		super(message || "Wrong syntax")
	}
}
