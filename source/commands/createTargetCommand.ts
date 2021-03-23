import { Message } from "discord.js"
import Game from "../systems/game_templates/Game"
import Player from "../systems/game_templates/Player"
import { CommandProperties, CommandUsageError, RoleCommand, RoleCommandAttributes } from "./CommandType"
import sarcasm from "../rolesystem/misc/sarcasm"

export interface TargetRoleCommand extends RoleCommandAttributes {
	(game: Game, message: Message, target: Player | "nobody", player: Player): void
}

interface TargetCommandData extends Omit<CommandProperties<RoleCommand>, "command"> {
	canPerformOnSelf?: boolean
	canPerformOnDeadPlayers?: boolean
	threshold?: boolean
	preValidation?: (game: Game, message: Message, params: string[], player: Player) => boolean | Promise<boolean>
}

export const createTargetCommand = (
	command: TargetRoleCommand,
	data: TargetCommandData
): CommandProperties<RoleCommand> => {
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
		const playerMatch = game.getPlayerMatch(params[0])
		if (playerMatch.score < threshold) {
			await message.reply(":x: Unknown player")
			return
		}
		const to = playerMatch.player
		if (!canPerformOnDeadPlayers && !to.isAlive()) {
			await message.reply(":x: You can't use your ability on a dead player! " + sarcasm())
			return
		}
		if (!canPerformOnSelf && player === to) {
			await message.reply("You can't use your ability on yourself! " + sarcasm())
			return
		}
		await command(game, message, to, player)
	}
	rc.role = command.role
	rc.attribute = command.attribute
	rc.ALIVE_CANNOT_USE = command.ALIVE_CANNOT_USE
	rc.ALLOW_NONSPECIFIC = command.ALLOW_NONSPECIFIC
	rc.DEAD_CANNOT_USE = command.DEAD_CANNOT_USE
	rc.DISALLOW_DAY = command.DISALLOW_DAY
	rc.DISALLOW_NIGHT = command.DISALLOW_NIGHT
	rc.PRIVATE_ONLY = command.PRIVATE_ONLY
	Object.assign(rc, command)
	return {
		...data,
		usage: data.usage || data.name + " <player | nobody>",
		command: rc,
	}
}

export default createTargetCommand
