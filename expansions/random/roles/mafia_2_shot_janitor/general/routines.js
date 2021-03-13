var lcn = require("../../../../../source/lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.janitor_cleans_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":drop_of_blood:  You may clean a player tonight. You have **" +
				player.misc.janitor_cleans_left +
				"** clean" +
				auxils.vocab("s", player.misc.janitor_cleans_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"clean <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":drop_of_blood:  You have run out of investigations.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
