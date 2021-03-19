import { WinCondition } from "../../../systems/win_conditions"
import auxils from "../../../systems/auxils"

const alien: WinCondition = (game) => {
	const aliens = game.findAll((x) => {
		if (x.role_identifier === "alien" && x.isAlive()) {
			const probed = x.misc.alien_kidnappings

			return (
				game.findAll((y) => y.isAlive() && !probed.includes(y.identifier) && y.identifier !== x.identifier).length < 1
			)
		} else {
			return false
		}
	})

	if (aliens.length > 0) {
		const winners = aliens.filter((x) => x.canWin())

		// Revolutionaries win
		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("alien-wins.png"))
		game.primeWinLog(
			"alien",
			"The extraterrestrial has gathered sufficient information to annihilate and control the planet."
		)
		return true
	}

	return false
}

alien.STOP_GAME = true
alien.STOP_CHECKS = false

alien.FACTIONAL = false

alien.PRIORITY = 1
alien.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
alien.ELIMINATED = []
alien.SURVIVING = ["alien"]

alien.PREVENT_CHECK_ON_WIN = []

alien.DESCRIPTION = "Everyone alive in the game has been probed and you are alive at that point in time."

export = alien
