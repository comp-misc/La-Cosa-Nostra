// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.messenger_messages_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":envelope:  You may choose to send a player an anonymous message tonight.\n\nYou have **" +
				player.misc.messenger_messages_left +
				"** message" +
				auxils.vocab("s", player.misc.messenger_messages_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"message <alphabet/name/nobody> <message>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":envelope:  You have run out of messages.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false