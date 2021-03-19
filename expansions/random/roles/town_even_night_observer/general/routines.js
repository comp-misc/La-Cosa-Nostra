var lcn = require("../../../../../lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.game.getPeriod() % 4 === 3) {
		player.game.sendPeriodPin(
			channel,
			":telescope:  You may pick a player to observe tonight.\n\nUse `" +
				config["command-prefix"] +
				"observe <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":telescope:  You may not observe a player tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false