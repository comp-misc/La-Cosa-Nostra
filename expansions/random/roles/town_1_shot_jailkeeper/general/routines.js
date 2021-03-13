var lcn = require("../../../../../source/lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.jailkeeper_jails_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":european_castle:  You may jail a player tonight using the faction kill.\n\nYou have **" +
				player.misc.jailkeeper_jails_left +
				"** jail" +
				auxils.vocab("s", player.misc.jailkeeper_jails_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"jail <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":european_castle:  You have run out of jails.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
