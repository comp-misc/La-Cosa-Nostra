import { WinCondition } from "../../../source/systems/win_conditions"

const lcn = require("../../../source/lcn")

const auxils = lcn.auxils

const serialKiller: WinCondition = (game) => {
	const alive = game.findAll((x) => x.isAlive())
	const serial_killers = game.findAll((x) => x.role_identifier === "3p_serial_killer" && x.isAlive())

	if (serial_killers.length >= alive.length / 2 && serial_killers.length == 1) {
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

serialKiller.STOP_GAME = true
serialKiller.STOP_CHECKS = false

serialKiller.FACTIONAL = false

serialKiller.PRIORITY = 2
serialKiller.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
serialKiller.ELIMINATED = [
	"mafia",
	"3p_arsonist_im_bp",
	"3p_serial_killer_im_bp",
	"3p_fool",
	"3p_jester",
	"3p_haunted_jester",
]
serialKiller.SURVIVING = ["3p_serial_killer"]

serialKiller.PREVENT_CHECK_ON_WIN = ["mafia"]

serialKiller.DESCRIPTION = "Kill everyone who can oppose you."

export = serialKiller
