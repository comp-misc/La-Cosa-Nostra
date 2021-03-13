// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.game.getPeriod() % 4 === 3) {
		player.game.sendPeriodPin(
			channel,
			":envelope:  You may choose to send a player an anonymous message tonight.\n\nUse `" +
				config["command-prefix"] +
				"message <alphabet/name/nobody> <message>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":envelope:  You may not message a player tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
