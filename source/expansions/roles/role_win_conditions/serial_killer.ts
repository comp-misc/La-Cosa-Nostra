import getAssetAttachment from "../../../auxils/getAssetAttachment"
import { WinCondition } from "../../../systems/win_conditions"

const serial_killer: WinCondition = async (game) => {
	const alive = game.findAllPlayers((x) => x.isAlive())
	const serial_killers = game.findAllPlayers(
		(x) => x.isAlive() && x.role.allPartsMetadata.some((role) => role.identifier === "serial_killer")
	)

	if (serial_killers.length >= alive.length / 2) {
		const winners = serial_killers.filter((x) => x.canWin())

		await game.setWins(winners)
		await game.getMainChannel().send(getAssetAttachment("serial-killer-wins.png"))
		game.primeWinLog("serial killer", "The Serial Killer has destroyed everyone who could oppose them.")

		/* Return true to stop the game/checks
    depending on the configuration below. */

		return true
	}

	return false
}

serial_killer.id = "serial_killer"
serial_killer.STOP_GAME = true
serial_killer.STOP_CHECKS = false

serial_killer.PRIORITY = 2
serial_killer.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
serial_killer.ELIMINATED = []
serial_killer.SURVIVING = ["serial_killer"]

serial_killer.PREVENT_CHECK_ON_WIN = ["mafia"]

serial_killer.DESCRIPTION = "You win when you are the last player alive."

export default serial_killer
