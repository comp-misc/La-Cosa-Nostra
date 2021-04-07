import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const basicHide = async <T>(
	actionable: Actionable<T>,
	game: Game,
	_params?: ExecutionParams,
	notify = true
): Promise<boolean> => {
	// const target = game.getPlayerByIdentifier(actionable.to)

	// Seen as visit
	await game.execute("visit", { visitor: actionable.from, target: actionable.to, priority: actionable.priority })

	// Stops all actions to the target that are roleblockable
	const actions = game.actions.findAll(
		(x) =>
			(x.to === actionable.to || x.to === actionable.target) &&
			x.tags.includes("roleblockable") &&
			!x.tags.includes("permanent") &&
			x.execution <= 0
	)

	if (notify) {
		for (const action of actions) {
			const affected = game.getPlayerByIdentifierOrThrow(action.from)
			game.addMessage(
				affected,
				":exclamation: Your action failed because your target was " + basicHide.reason + "!"
			)
		}
	}

	game.actions.delete(
		(x) =>
			(x.to === actionable.to || x.to === actionable.target) &&
			x.tags.includes("roleblockable") &&
			!x.tags.includes("permanent") &&
			x.execution <= 0
	)

	return true
}

basicHide.reason = "away"

export = basicHide
