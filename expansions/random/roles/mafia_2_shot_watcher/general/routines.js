var lcn = require("../../../../../source/lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.watcher_watches_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":telescope:  You may choose to watch a player tonight.\n\nYou have **" +
				player.misc.watcher_watches_left +
				"** watch" +
				auxils.vocab("es", player.misc.watcher_watches_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"watch <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":telescope:  You have run out of watches.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
