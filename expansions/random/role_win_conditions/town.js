var lcn = require("../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = function (game) {
	var winners = game.findAll((x) => x.role.alignment === "town" && x.canWin())

	game.setWins(winners)

	game.getMainChannel().send(auxils.getAssetAttachment("town-wins.png"))
	game.primeWinLog("town", "All threats to the Town have been wiped out.")

	return true
}

module.exports.STOP_GAME = true
module.exports.STOP_CHECKS = false

module.exports.FACTIONAL = true

module.exports.PRIORITY = 3
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = ["mafia", "3p_serial_killer_im_bp", "3p_arsonist_im_bp"]
module.exports.SURVIVING = ["town"]

module.exports.PREVENT_CHECK_ON_WIN = []

module.exports.DESCRIPTION = "Eliminate all threats to the Town."
