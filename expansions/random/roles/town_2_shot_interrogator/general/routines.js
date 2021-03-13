// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// daytime actions
	var channel = player.getPrivateChannel()

	if (player.misc.interrogates_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":chair:  You may interrogate a player today.\n\nYou have **" +
				player.misc.interrogates_left +
				"** interrogate" +
				auxils.vocab("s", player.misc.interrogates_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"interrogate <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":chair:  You have run out of interrogates.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = false
module.exports.ALLOW_DAY = true
