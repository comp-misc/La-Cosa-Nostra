import { Actionable, ExecutionParams } from "../../../../systems/game_templates/Actions"
import Game from "../../../../systems/game_templates/Game"

interface BasicCommute {
	<T>(
		actionable: Actionable<T>,
		game: Game,
		params?: ExecutionParams,
		notify?: boolean,
		consider_roleblocked?: boolean
	): boolean
	reason: string
}

const basicCommute: BasicCommute = (actionable, game, params, notify = false, consider_roleblocked = true) => {
	const target = game.getPlayerOrThrow(actionable.to)

	// Seen as visit
	game.execute("visit", { visitor: actionable.from, target: actionable.to, priority: actionable.priority })

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

			game.addMessage(affected, ":exclamation: Your action failed because your target was " + basicCommute.reason + "!")
		}
	}

	if (consider_roleblocked) {
		for (const action of actions) {
			// Consider user roleblocked by default
			game.execute("roleblock", {
				roleblocker: actionable.from,
				target: action.from,
				priority: actionable.priority,
				reason: "Commuter-roleblock",
			})
		}
	}

	target.setStatus("kidnapped", true)

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

basicCommute.reason = "away"

export = basicCommute
