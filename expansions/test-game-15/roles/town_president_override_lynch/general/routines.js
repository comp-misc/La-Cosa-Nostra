var mafia = require("../../../../../source/lcn.js")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = mafia.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.executions > 0) {
		player.game.sendPeriodPin(
			channel,
			":crossed_swords: You may choose to override a lynch today. \n\nUse `" +
				config["command-prefix"] +
				"kill <alphabet/name/nobody>` to select your target.\n\nThis action is irreversible."
		)
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = false
module.exports.ALLOW_DAY = true
