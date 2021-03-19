import auxils from "../../../systems/auxils"
import { WinCondition } from "../../../systems/win_conditions"

const arsonist: WinCondition = (game) => {
	const alive = game.findAll((x) => x.isAlive())
	const arsonist = game.findAll((x) => x.role_identifier === "arsonist" && x.isAlive())

	if (arsonist.length >= alive.length / 2) {
		const winners = arsonist.filter((x) => x.canWin())

		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("arsonist-wins.png"))
		game.primeWinLog(
			"arsonist",
			"Wearing a half-smile as an expression, the Arsonist has burned the Town into oblivion."
		)

		/* Return true to stop the game/checks
    depending on the configuration below. */

		return true
	}

	/* Return true to stop the game/checks
  depending on the configuration below. */

	return true
}

arsonist.STOP_GAME = true
arsonist.STOP_CHECKS = false

arsonist.FACTIONAL = false

arsonist.PRIORITY = 0
arsonist.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
arsonist.ELIMINATED = ["town", "mafia", "serial_killer", "revolutionary"]
arsonist.SURVIVING = ["arsonist"]

arsonist.PREVENT_CHECK_ON_WIN = []

arsonist.DESCRIPTION = "Kill everyone who can oppose you."

export = arsonist
