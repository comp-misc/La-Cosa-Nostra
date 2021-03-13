// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.kidnapper_kidnaps_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":helicopter:  You may kidnap a player tonight.\n\nYou have **" +
				player.misc.kidnapper_kidnaps_left +
				"** kidnap" +
				auxils.vocab("s", player.misc.kidnapper_kidnaps_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"kidnap <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":helicopter:  You have run out of kidnaps.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
