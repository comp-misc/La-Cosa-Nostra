import auxils from "../systems/auxils"
import { WinCondition } from "../systems/win_conditions"

const cult: WinCondition = (game) => {
	// Reach parity with surviving players
	// Eliminated other roles

	// Return true to determine win

	const alive = game.findAll((x) => x.isAlive())
	const cult = game.findAll((x) => x.expandedRole().alignment === "cult" && x.isAlive())

	if (cult.length >= alive.length / 2) {
		// Parity reached

		const winners = cult.filter((x) => x.canWin())

		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("cult-wins.png"))
		game.primeWinLog("cult", "Through brainwashing and murder, the Cult has gained complete control.")

		return true
	}

	return false
}

cult.STOP_GAME = true
cult.STOP_CHECKS = false

cult.FACTIONAL = true

cult.PRIORITY = 3
cult.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
cult.ELIMINATED = ["neutral-killing", "revolutionary", "death", "pestilence", "mafia"]
cult.SURVIVING = ["cult"]

cult.PREVENT_CHECK_ON_WIN = []

cult.DESCRIPTION = "Survive and reach parity as the cult."

export = cult
