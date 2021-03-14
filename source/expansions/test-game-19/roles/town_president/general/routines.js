var lcn = require("../../../../../lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.executions > 0) {
		player.game.sendPeriodPin(
			channel,
			":crossed_swords:  You may choose to override a lynch today. \n\nUse `" +
				config["command-prefix"] +
				"execute <alphabet/name/nobody>` to select your target.\n\nThis action is irreversible."
		)
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = false
module.exports.ALLOW_DAY = true