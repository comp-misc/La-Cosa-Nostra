// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.game.getPeriod() % 4 === 2) {
		player.game.sendPeriodPin(
			channel,
			":gun:  You may choose to shoot a player today.\n\nUse `" +
				config["command-prefix"] +
				"shoot <alphabet/name/nobody>` to select your target.\n\nThis action is irreversible."
		)
	} else {
		player.game.sendPeriodPin(channel, ":gun:  You may not interrogate a player tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = false
module.exports.ALLOW_DAY = true
