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
			":european_castle:  You may jail a player tonight using the faction kill.\n\nUse `" +
				config["command-prefix"] +
				"jail <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":european_castle:  You may not jail a player tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false