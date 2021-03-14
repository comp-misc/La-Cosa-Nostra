// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// daytime actions
	var channel = player.getPrivateChannel()

	player.game.addAction("town_nonconsecutive_interrogator/no_action", ["cycle"], {
		name: "SE-no_action",
		expiry: 1,
		from: player,
		to: player,
	})

	if (player.misc.consecutive_night === false) {
		player.game.sendPeriodPin(
			channel,
			":chair:  You may interrogate a player today.\n\nUse `" +
				config["command-prefix"] +
				"interrogate <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":chair:  You may not interrogate a player tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = false
module.exports.ALLOW_DAY = true