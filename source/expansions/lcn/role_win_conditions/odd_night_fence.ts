import { WinCondition } from "../../../systems/win_conditions"

const odd_night_fence: WinCondition = (game) => {
	// Have to manually set the win
	const winners = game.findAll((x) => x.role_identifier === "odd_night_fence" && x.isAlive() && x.canWin())

	game.setWins(winners)

	/* Return true to stop the game/checks
  depending on the configuration below. */

	return true
}

odd_night_fence.STOP_GAME = false
odd_night_fence.STOP_CHECKS = false

odd_night_fence.FACTIONAL = false

odd_night_fence.PRIORITY = 4
odd_night_fence.CHECK_ONLY_WHEN_GAME_ENDS = true

// Accepts function
// Should key in wrt to player
odd_night_fence.ELIMINATED = []
odd_night_fence.SURVIVING = ["odd_night_fence"]

odd_night_fence.PREVENT_CHECK_ON_WIN = []

odd_night_fence.DESCRIPTION = "Survive to the end of the game at all costs."

export = odd_night_fence
