import { WinCondition } from "../../../systems/win_conditions"
import Recruitable from "../roles/recruitable"

const recruitable: WinCondition = async (game) => {
	// Have to manually set the win
	const winners = game.findAllPlayers((x) => x.role.hasPart(Recruitable) && x.isAlive() && x.canWin())

	await game.setWins(winners)

	/* Return true to stop the game/checks
    depending on the configuration below. */

	return true
}

recruitable.id = "recruitable"
recruitable.STOP_GAME = false
recruitable.STOP_CHECKS = false

recruitable.PRIORITY = 4
recruitable.CHECK_ONLY_WHEN_GAME_ENDS = true

// Accepts function
// Should key in wrt to player
recruitable.ELIMINATED = []
recruitable.SURVIVING = []

recruitable.PREVENT_CHECK_ON_WIN = []

recruitable.DESCRIPTION =
	"As Recruitable: Survive until the game ends\n - As Mafia: Eliminate the other Mafia Team and Patient Zero, and gain a majority"

export default recruitable
