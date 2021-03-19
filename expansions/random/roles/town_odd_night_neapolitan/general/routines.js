var lcn = require("../../../../../lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.game.getPeriod() % 4 === 1) {
		player.game.sendPeriodPin(
			channel,
			":mag_right:  You may investigate a player tonight.\n\nUse `" +
				config["command-prefix"] +
				"investigate <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":mag_right:  You may not investigate a player tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false