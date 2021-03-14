var lcn = require("../../../../../lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.bodyguard_guards_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":shield:  You may guard a player tonight.\n\nYou have **" +
				player.misc.bodyguard_guards_left +
				"** guard" +
				auxils.vocab("s", player.misc.bodyguard_guards_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"guard <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":shield:  You have run out of guards.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false