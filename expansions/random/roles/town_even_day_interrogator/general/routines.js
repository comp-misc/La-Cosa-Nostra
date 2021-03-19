// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// daytime actions
	var channel = player.getPrivateChannel()

	if (player.game.getPeriod() % 4 === 0) {
		player.game.sendPeriodPin(
			channel,
			":chair:  You may interrogate a player today.\n\nUse `" +
				config["command-prefix"] +
				"interrogate <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":chair:  You may not interrogate a player tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = false
module.exports.ALLOW_DAY = true
