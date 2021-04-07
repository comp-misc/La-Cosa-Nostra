import { Actionable } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const removePoison = <T>(actionable: Actionable<T>, game: Game): boolean => {
	// const from = game.getPlayerByIdentifier(actionable.from)
	// const to = game.getPlayerByIdentifier(actionable.to)

	const removed = game.actions.delete((x) => x.tags.includes("poison") && x.to === actionable.to)
	return removed.length > 0
}

export = removePoison
