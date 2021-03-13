import { WinCondition } from "../../../source/systems/win_conditions"

const jester: WinCondition = (game) => {
	const jesters = game.findAll(
		(x) => x.role_identifier === "3p_jester" && !x.isAlive() && x.misc.jester_lynched === true && !x.hasWon()
	)

	if (jesters.length > 0) {
		const winners = jesters.filter((x) => x.canWin())

		game.setWins(winners)
		return true
	}

	return false
}

jester.STOP_GAME = false
jester.STOP_CHECKS = false

jester.FACTIONAL = false

jester.PRIORITY = 0
jester.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
jester.ELIMINATED = []
jester.SURVIVING = []

jester.PREVENT_CHECK_ON_WIN = []

jester.DESCRIPTION = "Get yourself lynched at all costs."

export = jester
