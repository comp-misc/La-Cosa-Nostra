import auxils from "../systems/auxils"
import { WinCondition } from "../systems/win_conditions"

const revolutionary: WinCondition = (game) => {
	const revolutionaries = game.findAll(
		(x) => x.role_identifier === "revolutionary" && x.isAlive() && x.misc.revolutionary_kills_left < 1
	)

	if (revolutionaries.length > 0) {
		const winners = revolutionaries.filter((x) => x.canWin())

		// Revolutionaries win
		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("revolutionary-wins.png"))
		game.primeWinLog("revolutionary", "Half-smile on face, the Revolutionary has taken complete control.")
		return true
	}

	return false
}

revolutionary.STOP_GAME = true
revolutionary.STOP_CHECKS = false

revolutionary.FACTIONAL = false

revolutionary.PRIORITY = 2
revolutionary.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
revolutionary.ELIMINATED = []
revolutionary.SURVIVING = []

revolutionary.PREVENT_CHECK_ON_WIN = []

revolutionary.DESCRIPTION = "Kill three people using the Revolutionary-bomb trick."

export = revolutionary
