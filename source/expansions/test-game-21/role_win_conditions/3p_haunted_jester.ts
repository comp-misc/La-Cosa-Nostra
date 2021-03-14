import { WinCondition } from "../../../systems/win_conditions"

const hauntedJester: WinCondition = (game) => {
	const haunted_jesters = game.findAll(
		(x) =>
			x.role_identifier === "3p_haunted_jester" && !x.isAlive() && x.misc.haunted_jester_lynched === true && !x.hasWon()
	)

	if (haunted_jesters.length > 0) {
		const winners = haunted_jesters.filter((x) => x.canWin())

		game.setWins(winners)
		return true
	}

	return false
}

hauntedJester.STOP_GAME = false
hauntedJester.STOP_CHECKS = false

hauntedJester.FACTIONAL = false

hauntedJester.PRIORITY = 0
hauntedJester.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
hauntedJester.ELIMINATED = []
hauntedJester.SURVIVING = []

hauntedJester.PREVENT_CHECK_ON_WIN = []

hauntedJester.DESCRIPTION = "Get yourself lynched at all costs."

export = hauntedJester