import Game from "../../game_templates/Game"
import conditions from "../../win_conditions"

export default (game: Game): void => {
	const win_conditions: string[] = []

	game.players.forEach((player) => {
		const winCondition = player.getRoleOrThrow()["win-condition"]
		if (!winCondition) {
			throw new Error("Every role should have a win condition!")
		}
		if (win_conditions.includes(winCondition.toLowerCase())) {
			return
		}
		win_conditions.push(winCondition)
	})

	// Sort by priority
	win_conditions.sort((a, b) => conditions[a].PRIORITY - conditions[b].PRIORITY)

	// Boolean that is changed if game is to be ended
	let end_game = false
	let skip_condition: string[] = []

	// Execute the win conditions
	for (let i = 0; i < win_conditions.length; i++) {
		if (skip_condition.includes(win_conditions[i])) {
			continue
		}

		const condition = conditions[win_conditions[i]]

		if (typeof condition !== "function") {
			throw new Error(win_conditions[i] + " is not a valid win condition!")
		}

		if (!end_game && condition.CHECK_ONLY_WHEN_GAME_ENDS) {
			// Special attribute for roles such as Survivor
			continue
		}

		// Check all the nitty gritty configurations of the condition

		let eliminated = true
		for (let j = 0; j < (condition.ELIMINATED || []).length; j++) {
			// Check if all dead
			const query = condition.ELIMINATED[j]
			const out = game.checkRole(query)

			if (out) {
				eliminated = false
				break
			}
		}

		let surviving = false
		for (let j = 0; j < (condition.SURVIVING || []).length; j++) {
			// Check if all dead
			const query = condition.SURVIVING[j]
			const out = game.checkRole(query)

			if (out) {
				surviving = true
				break
			}
		}

		if (condition.SURVIVING.length < 1 || !condition.SURVIVING) {
			surviving = true
		}

		if (eliminated && surviving) {
			// Run the condition
			const response = condition(game)

			// Winners would already have been declared
			// by condition function

			if (response && Array.isArray(condition.PREVENT_CHECK_ON_WIN)) {
				skip_condition = skip_condition.concat(condition.PREVENT_CHECK_ON_WIN.map((x) => x.toLowerCase()))
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
		game.postWinLog()
		game.endGame()
	}
}
