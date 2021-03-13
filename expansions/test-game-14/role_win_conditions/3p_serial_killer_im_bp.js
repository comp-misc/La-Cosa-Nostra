var lcn = require("../../../source/lcn")

var auxils = lcn.auxils

module.exports = function (game) {
	var alive = game.findAll((x) => x.isAlive())
	var serial_killers_im_bp = game.findAll((x) => x.role_identifier === "3p_serial_killer_im_bp" && x.isAlive())

	if (serial_killers_im_bp.length >= alive.length / 2 && serial_killers_im_bp.length == 1) {
		var winners = serial_killers_im_bp.filter((x) => x.canWin())

		game.setWins(winners)
		game.getMainChannel().send(auxils.getAssetAttachment("serial-killer-wins.png"))
		game.primeWinLog("serial killer", "The Serial Killer has destroyed everyone who could oppose them.")

		/* Return true to stop the game/checks
    depending on the configuration below. */

		return true
	}

	return false
}

module.exports.STOP_GAME = true
module.exports.STOP_CHECKS = false

module.exports.FACTIONAL = false

module.exports.PRIORITY = 2
module.exports.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
module.exports.ELIMINATED = [
	"mafia",
	"3p_arsonist_im_bp",
	"3p_serial_killer",
	"3p_fool",
	"3p_jester",
	"3p_haunted_jester",
]
module.exports.SURVIVING = ["3p_serial_killer_im_bp"]

module.exports.PREVENT_CHECK_ON_WIN = ["mafia"]

module.exports.DESCRIPTION = "Kill everyone who can oppose you."
