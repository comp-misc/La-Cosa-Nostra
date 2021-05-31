import JackOfAllTrades from ".."
import createTargetCommand, { TargetCommand, TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import Game from "../../../../../systems/game_templates/Game"
import Player from "../../../../../systems/game_templates/Player"
import Ability from "../Ability"

const createCommand = (data: {
	addAction: (game: Game, from: Player, target: Player) => Promise<void>
	onNoAction?: (game: Game, from: Player) => void | Promise<void>
	actionVerb: string
	actionType: Ability
	emoji: string
	commandName: string
	commandDescription: string
}): TargetCommand => {
	const { onNoAction, addAction, actionVerb, actionType, emoji, commandName, commandDescription } = data
	const cmd: TargetRoleCommand = async (game, message, target, from) => {
		game.actions.delete((x) => x.from === from.identifier && x.identifier === "jack_of_all_trades/")

		if (target === "nobody") {
			from.misc.currentAction = null
			await message.reply(
				`${emoji} You have decided not to ${actionVerb} anyone tonight. You have deselected all actions`
			)
			if (onNoAction) {
				await onNoAction(game, from)
			}
			return
		}

		from.misc.currentAction = actionType
		await addAction(game, from, target)

		await message.reply(
			`${emoji} You have decided to ${actionVerb} **${target.getDisplayName()}** tonight.\nYou have deselected all other actions`
		)
	}
	cmd.PRIVATE_ONLY = true
	cmd.DEAD_CANNOT_USE = true
	cmd.ALIVE_CANNOT_USE = false
	cmd.DISALLOW_DAY = true
	cmd.DISALLOW_NIGHT = false

	return createTargetCommand(cmd, {
		name: commandName,
		description: commandDescription,
		preValidation: async (_game, message, _params, from) => {
			if (JackOfAllTrades.hasUsedAbility(from, actionType)) {
				await message.reply(":x: You have already used that ability!")
				return false
			}
			return true
		},
	})
}

export default createCommand
