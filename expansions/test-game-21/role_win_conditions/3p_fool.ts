import { WinCondition } from "../../../source/systems/win_conditions"

const lcn = require("../../../source/lcn")

const auxils = lcn.auxils

const fool: WinCondition = (game) => {
	const fools = game.findAll(
		(x) => x.role_identifier === "3p_fool" && !x.isAlive() && x.misc.fool_lynched === true && !x.hasWon()
	)

	if (fools.length > 0) {
		const winners = fools.filter((x) => x.canWin())

		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("fool-wins.png"))
		game.primeWinLog("fool", "The Fool has successfully got themself lynched, to town's full embarrassement.")

		return true
	}

	return false
}

fool.STOP_GAME = true
fool.STOP_CHECKS = false

fool.FACTIONAL = false

fool.PRIORITY = 0
fool.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
fool.ELIMINATED = []
fool.SURVIVING = []

fool.PREVENT_CHECK_ON_WIN = []

fool.DESCRIPTION = "Get yourself lynched at all costs."

export = fool
