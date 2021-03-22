import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const removePoison = <T>(actionable: Actionable<T>, game: Game, params: ExecutionParams): boolean => {
	// const from = game.getPlayerByIdentifier(actionable.from)
	// const to = game.getPlayerByIdentifier(actionable.to)

	const removed = game.actions.delete((x) => x.tags.includes("poison") && x.to === actionable.to)

	if (removed.length > 0) {
		return true
	} else {
		return false
	}
}

export = removePoison
