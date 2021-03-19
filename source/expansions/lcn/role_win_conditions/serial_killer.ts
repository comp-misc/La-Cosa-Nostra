import auxils from "../../../systems/auxils"
import { WinCondition } from "../../../systems/win_conditions"

const serial_killer: WinCondition = (game) => {
	const alive = game.findAll((x) => x.isAlive())
	const serial_killers = game.findAll((x) => x.role_identifier === "serial_killer" && x.isAlive())

	if (serial_killers.length >= alive.length / 2) {
		const winners = serial_killers.filter((x) => x.canWin())

		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("serial-killer-wins.png"))
		game.primeWinLog("serial killer", "The Serial Killer has destroyed everyone who could oppose them.")

		/* Return true to stop the game/checks
    depending on the configuration below. */

		return true
	}

	return false
}

serial_killer.STOP_GAME = true
serial_killer.STOP_CHECKS = false

serial_killer.FACTIONAL = false

serial_killer.PRIORITY = 2
serial_killer.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
serial_killer.ELIMINATED = []
serial_killer.SURVIVING = ["serial_killer"]

serial_killer.PREVENT_CHECK_ON_WIN = ["mafia"]

serial_killer.DESCRIPTION = "Kill everyone who can oppose you."

export = serial_killer
