var lcn = require("../../../../../source/lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.neapolitan_investigates_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":mag_right:  You may investigate a player tonight.\n\nYou have **" +
				player.misc.neapolitan_investigates_left +
				"** investigate" +
				auxils.vocab("s", player.misc.neapolitan_investigates_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"investigate <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":mag_right:  You have run out of investigates.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
