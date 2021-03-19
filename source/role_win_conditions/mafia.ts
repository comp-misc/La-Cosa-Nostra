import auxils from "../systems/auxils"
import { WinCondition } from "../systems/win_conditions"

const mafia: WinCondition = (game) => {
	// Reach parity with surviving players
	// Eliminated other roles

	// Return true to determine win

	const alive = game.findAll((x) => x.isAlive())
	const mafia = game.findAll((x) => x.expandedRole().alignment === "mafia" && x.isAlive())

	if (mafia.length >= alive.length / 2) {
		// Parity reached

		const winners = game.findAll((x) => x.expandedRole().alignment === "mafia" && x.canWin())

		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("mafia-wins.png"))
		game.primeWinLog("mafia", "The Mafia has successfully eliminated all threats to itself.")

		return true
	}

	return false
}

mafia.STOP_GAME = true
mafia.STOP_CHECKS = false

mafia.FACTIONAL = true

mafia.PRIORITY = 3
mafia.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
mafia.ELIMINATED = ["neutral-killing", "revolutionary", "death", "pestilence", "cult", "arsonist"]
mafia.SURVIVING = ["mafia"]

mafia.PREVENT_CHECK_ON_WIN = []

mafia.DESCRIPTION = "Destroy anybody who would not submit to the Mafia."

export = mafia
