import { Message } from "discord.js"
import { LcnConfig } from "../LcnConfig"
import Game from "../systems/game_templates/Game"
import Player from "../systems/game_templates/Player"
import { CommandProperties, CommandUsageError, RoleCommand, RoleCommandAttributes } from "./CommandType"

export interface TargetRoleCommand extends RoleCommandAttributes {
	(game: Game, message: Message, target: Player | "nobody", player: Player): void
}

interface TargetCommandData extends Omit<CommandProperties<RoleCommand>, "command"> {
	canPerformOnSelf?: boolean
	canPerformOnDeadPlayers?: boolean
	threshold?: boolean
	preValidation?: (game: Game, message: Message, params: string[], player: Player) => boolean | Promise<boolean>
}

export interface TargetCommand extends CommandProperties<RoleCommand> {
	formatUsageDescription: (config: LcnConfig) => string
}

export const createTargetCommand = (command: TargetRoleCommand, data: TargetCommandData): TargetCommand => {
	const { canPerformOnSelf = false, canPerformOnDeadPlayers = false, threshold = 0.7, preValidation } = data

	const rc: RoleCommand = async (game, message, params, player) => {
		if (preValidation && !(await preValidation(game, message, params, player))) {
			return
		}
		if (params.length === 0) {
			throw new CommandUsageError()
		}
		const playerName = params.join(" ")
		if (playerName.toLowerCase() === "nobody") {
			await command(game, message, "nobody", player)
			return
		}
		const playerMatch = game.getPlayerMatch(playerName)
		if (playerMatch.score < threshold) {
			await message.reply(":x: Unknown player")
			return
		}
		const to = playerMatch.player
		if (!canPerformOnDeadPlayers && !to.isAlive()) {
			await message.reply(":x: You can't use your ability on a dead player!")
			return
		}
		if (!canPerformOnSelf && player === to) {
			await message.reply("You can't use your ability on yourself!")
			return
		}
		await command(game, message, to, player)
	}
	rc.attribute = command.attribute
	rc.ALIVE_CANNOT_USE = command.ALIVE_CANNOT_USE
	rc.DEAD_CANNOT_USE = command.DEAD_CANNOT_USE
	rc.DISALLOW_DAY = command.DISALLOW_DAY
	rc.DISALLOW_NIGHT = command.DISALLOW_NIGHT
	rc.PRIVATE_ONLY = command.PRIVATE_ONLY
	Object.assign(rc, command)
	return {
		...data,
		usage: data.usage || data.name + " <player | nobody>",
		command: rc,
		formatUsageDescription: (config) =>
			"Use `" + config["command-prefix"] + data.name + " <player | nobody>` to select your target.",
	}
}

export default createTargetCommand
