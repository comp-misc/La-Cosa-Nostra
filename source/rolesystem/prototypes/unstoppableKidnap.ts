import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const unstoppableKidnap = <T>(
	actionable: Actionable<T>,
	game: Game,
	params?: ExecutionParams,
	notify = true
): boolean => {
	const target = game.getPlayerByIdentifierOrThrow(actionable.to)

	const stat = target.getStat("kidnap-immunity", Math.max)

	if (stat < 2) {
		// Seen as visit
		game.execute("visit", { visitor: actionable.from, target: actionable.to, priority: actionable.priority })

		// Stops all actions to the target that are roleblockable
		const actions = game.actions.findAll(
			(x) =>
				(x.to === actionable.to || x.to === actionable.target) &&
				x.tags.includes("visit") &&
				!x.tags.includes("permanent") &&
				x.execution <= 0
		)

		if (notify) {
			for (let i = 0; i < actions.length; i++) {
				// Inform of failure

				const action = actions[i]

				const affected = game.getPlayerByIdentifierOrThrow(action.from)

				game.addMessage(
					affected,
					":exclamation: Your action failed because your target was " + unstoppableKidnap.reason + "!"
				)
			}
		}

		target.setStatus("kidnapped", true)

		game.actions.delete((x) => x.from === actionable.to && x.tags.includes("visit"))
		game.actions.delete(
			(x) =>
				(x.to === actionable.to || x.to === actionable.target) &&
				x.tags.includes("visit") &&
				!x.tags.includes("permanent") &&
				x.execution <= 0
		)

		return true
	}
	return false
}

unstoppableKidnap.reason = "away"

export = unstoppableKidnap