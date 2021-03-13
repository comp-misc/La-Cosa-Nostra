import { Actionable } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const unstoppableDefense = <T>(actionable: Actionable<T>, game: Game): boolean => {
	// const from = game.getPlayerByIdentifier(actionable.from)
	const to = game.getPlayerByIdentifierOrThrow(actionable.to)

	// Set stats or do whatever
	to.setGameStat("basic-defense", 3, Math.max)

	return true
}

export = unstoppableDefense
