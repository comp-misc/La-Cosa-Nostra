import auxils from "../../../systems/auxils"
import { WinCondition } from "../../../systems/win_conditions"

const pestilence: WinCondition = (game) => {
	const alive = game.findAll((x) => x.isAlive())
	const pestilence = game.findAll(
		(x) => (x.role_identifier === "pestilence" || x.role_identifier === "plaguebearer") && x.isAlive()
	)

	if (pestilence.length >= alive.length / 2) {
		const winners = game.findAll(
			(x) => (x.role_identifier === "pestilence" || x.role_identifier === "plaguebearer") && x.isAlive() && x.canWin()
		)

		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("pestilence-wins.png"))
		game.primeWinLog("pestilence", "The Horseman of the Apocalypse reigns with fear.")

		/* Return true to stop the game/checks
    depending on the configuration below. */

		return true
	}

	return false
}

pestilence.STOP_GAME = true
pestilence.STOP_CHECKS = false

pestilence.FACTIONAL = false

pestilence.PRIORITY = 0
pestilence.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
pestilence.ELIMINATED = ["serial_killer", "revolutionary"]
pestilence.SURVIVING = [(x) => x.role_identifier === "plaguebearer" || x.role_identifier === "pestilence"]

pestilence.PREVENT_CHECK_ON_WIN = ["mafia"]

pestilence.DESCRIPTION = "Kill everyone who can oppose you."

export = pestilence
