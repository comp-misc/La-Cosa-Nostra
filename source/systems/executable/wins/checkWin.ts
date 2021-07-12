import getUniqueArray from "../../../auxils/getUniqueArray"
import Game from "../../game_templates/Game"

export default async (game: Game): Promise<void> => {
	const win_conditions = getUniqueArray(game.players.map((p) => p.role.winCondition))

	// Sort by priority
	win_conditions.sort((a, b) => a.PRIORITY - b.PRIORITY)

	// Boolean that is changed if game is to be ended
	let end_game = false
	const skip_condition: string[] = []

	// Execute the win conditions
	for (const condition of win_conditions) {
		if (skip_condition.includes(condition.id.toLowerCase())) {
			continue
		}
		if (!end_game && condition.CHECK_ONLY_WHEN_GAME_ENDS) {
			// Special attribute for roles such as Survivor
			continue
		}

		// Check all the nitty gritty configurations of the condition

		const eliminated = condition.ELIMINATED.every((query) => !game.doesPlayerExist(query))
		const surviving =
			condition.SURVIVING.length === 0 || condition.SURVIVING.some((query) => game.doesPlayerExist(query))

		if (eliminated && surviving) {
			// Run the condition
			const response = await condition(game)

			// Winners would already have been declared
			// by condition function

			if (response) {
				skip_condition.push(...condition.PREVENT_CHECK_ON_WIN.map((x) => x.toLowerCase()))
			}

			if (response && condition.STOP_GAME) {
				// Game has ended
				end_game = true
			}

			if (response && condition.STOP_CHECKS) {
				// Equivalent to sole winner
				// However can be used otherwise
				break
			}
		}
	}

	if (end_game) {
		// Kill the game
		await game.postWinLog()
		await game.endGame()
	}
}
