import auxils from "../../../systems/auxils"
import { WinCondition } from "../../../systems/win_conditions"

const serialKillerBP: WinCondition = (game) => {
	const alive = game.findAll((x) => x.isAlive())
	const serial_killers_im_bp = game.findAll((x) => x.role_identifier === "3p_serial_killer_im_bp" && x.isAlive())

	if (serial_killers_im_bp.length >= alive.length / 2 && serial_killers_im_bp.length == 1) {
		const winners = serial_killers_im_bp.filter((x) => x.canWin())

		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("serial-killer-wins.png"))
		game.primeWinLog("serial killer", "The Serial Killer has destroyed everyone who could oppose them.")

		/* Return true to stop the game/checks
    depending on the configuration below. */

		return true
	}

	return false
}

serialKillerBP.STOP_GAME = true
serialKillerBP.STOP_CHECKS = false

serialKillerBP.FACTIONAL = false

serialKillerBP.PRIORITY = 2
serialKillerBP.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
serialKillerBP.ELIMINATED = [
	"mafia",
	"3p_arsonist_im_bp",
	"3p_serial_killer",
	"3p_fool",
	"3p_jester",
	"3p_haunted_jester",
]
serialKillerBP.SURVIVING = ["3p_serial_killer_im_bp"]

serialKillerBP.PREVENT_CHECK_ON_WIN = ["mafia"]

serialKillerBP.DESCRIPTION = "Kill everyone who can oppose you."

export = serialKillerBP
