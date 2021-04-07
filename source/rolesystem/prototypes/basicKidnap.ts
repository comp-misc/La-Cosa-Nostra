import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const basicKidnap = async <T>(
	actionable: Actionable<T>,
	game: Game,
	params?: ExecutionParams,
	notify = false,
	consider_roleblocked = true
): Promise<boolean> => {
	const target = game.getPlayerOrThrow(actionable.to)

	const stat = target.getStat("kidnap-immunity", Math.max)

	if (stat >= 1) {
		return false
	}
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
			const affected = game.getPlayerOrThrow(action.from)
			game.addMessage(
				affected,
				":exclamation: Your action failed because your target was " + basicKidnap.reason + "!"
			)
		}
	}

	if (consider_roleblocked) {
		for (const action of actions) {
			await game.execute("roleblock", {
				roleblocker: actionable.from,
				target: action.from,
				priority: actionable.priority,
				reason: "Kidnapper-roleblock",
			})
		}
	}

	target.setStatus("kidnapped", true)

	if (consider_roleblocked) {
		await game.execute("roleblock", {
			roleblocker: actionable.from,
			target: actionable.to,
			priority: actionable.priority,
			reason: "Kidnapper-roleblock",
		})
	}

	game.actions.delete((x) => x.from === actionable.to && x.tags.includes("roleblockable"))
	game.actions.delete(
		(x) =>
			(x.to === actionable.to || x.to === actionable.target) &&
			x.tags.includes("roleblockable") &&
			!x.tags.includes("permanent") &&
			x.execution <= 0
	)

	return true
}

basicKidnap.reason = "away"

export = basicKidnap
