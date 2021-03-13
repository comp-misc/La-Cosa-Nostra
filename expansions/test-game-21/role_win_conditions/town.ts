import { WinCondition } from "../../../source/systems/win_conditions"

const lcn = require("../../../source/lcn")

const auxils = lcn.auxils

const town: WinCondition = (game) => {
	const winners = game.findAll((x) => x.expandedRole().alignment === "town" && x.canWin())

	game.setWins(winners)

	game.getMainChannel().send(auxils.getAssetAttachment("town-wins.png"))
	game.primeWinLog("town", "All threats to the Town have been wiped out.")

	return true
}

town.STOP_GAME = true
town.STOP_CHECKS = false

town.FACTIONAL = true

town.PRIORITY = 3
town.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
town.ELIMINATED = ["mafia", "3p_serial_killer_im_bp", "3p_serial_killer", "3p_arsonist_im_bp"]
town.SURVIVING = ["town"]

town.PREVENT_CHECK_ON_WIN = []

town.DESCRIPTION = "Eliminate all threats to the Town."

export = town
