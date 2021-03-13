import lcn from "../../../source/lcn"
import { WinCondition } from "../../../source/systems/win_conditions"

const auxils = lcn.auxils

const arsonist: WinCondition = (game) => {
	const alive = game.findAll((x) => x.isAlive())
	const arsonist = game.findAll((x) => x.role_identifier === "3p_arsonist_im_bp" && x.isAlive())

	if (arsonist.length >= alive.length / 2 && arsonist.length == 1) {
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
arsonist.ELIMINATED = [
	"mafia",
	"3p_serial_killer",
	"3p_serial_killer_im_bp",
	"3p_fool",
	"3p_jester",
	"3p_haunted_jester",
]
arsonist.SURVIVING = ["3p_arsonist_im_bp"]

arsonist.PREVENT_CHECK_ON_WIN = []

arsonist.DESCRIPTION = "Kill everyone who can oppose you."

export = arsonist
