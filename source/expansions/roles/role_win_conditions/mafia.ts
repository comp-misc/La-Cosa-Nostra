import auxils from "../../../systems/auxils"
import { WinCondition } from "../../../systems/win_conditions"

const mafia: WinCondition = async (game) => {
	// Reach parity with surviving players
	// Eliminated other roles

	// Return true to determine win

	const alive = game.findAllPlayers((x) => x.isAlive())
	const mafia = game.findAllPlayers((x) => x.role.properties.alignment.id === "mafia" && x.isAlive())

	if (mafia.length >= alive.length / 2) {
		// Parity reached

		const winners = game.findAllPlayers((x) => x.role.properties.alignment.id === "mafia" && x.canWin())

		await game.setWins(winners)
		await game.getMainChannel().send(auxils.getAssetAttachment("mafia-wins.png"))
		game.primeWinLog("mafia", "The Mafia has successfully eliminated all threats to itself.")

		return true
	}

	return false
}

mafia.id = "mafia"
mafia.STOP_GAME = true
mafia.STOP_CHECKS = false

mafia.PRIORITY = 3
mafia.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
mafia.ELIMINATED = ["neutral-killing", "revolutionary", "death", "pestilence", "cult", "arsonist", "serial_killer"]
mafia.SURVIVING = ["mafia"]

mafia.PREVENT_CHECK_ON_WIN = []

mafia.DESCRIPTION = "You win when mafia gains majority and all other threats are eliminated."

export default mafia
