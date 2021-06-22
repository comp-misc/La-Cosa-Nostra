import { WinCondition } from "../../../systems/win_conditions"

const stalemate: WinCondition = (game) => {
	const alive = game.findAllPlayers((x) => x.isAlive())

	if (alive.length < 1) {
		game.primeWinLog("stalemate", "Nobody wins.")
		return true
	}

	return false
}

stalemate.STOP_GAME = true
stalemate.STOP_CHECKS = false

stalemate.PRIORITY = 10
stalemate.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
stalemate.ELIMINATED = []
stalemate.SURVIVING = []

stalemate.PREVENT_CHECK_ON_WIN = []

stalemate.DESCRIPTION = "A stalemate condition where nobody wins."

export default stalemate
