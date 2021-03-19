import { WinCondition } from "../../../systems/win_conditions"

const survivor: WinCondition = (game) => {
	// Have to manually set the win
	const winners = game.findAll((x) => x.role_identifier === "survivor" && x.isAlive() && x.canWin())

	game.setWins(winners)

	/* Return true to stop the game/checks
  depending on the configuration below. */

	return true
}

survivor.STOP_GAME = false
survivor.STOP_CHECKS = false

survivor.FACTIONAL = false

survivor.PRIORITY = 4
survivor.CHECK_ONLY_WHEN_GAME_ENDS = true

// Accepts function
// Should key in wrt to player
survivor.ELIMINATED = []
survivor.SURVIVING = ["survivor"]

survivor.PREVENT_CHECK_ON_WIN = []

survivor.DESCRIPTION = "Survive to the end of the game at all costs."

export = survivor
