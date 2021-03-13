// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// daytime actions
	var channel = player.getPrivateChannel()

	player.game.sendPeriodPin(
		channel,
		":cop: You may interrogate a player today.\n\nUse `" +
			config["command-prefix"] +
			"interrogate <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = false
module.exports.ALLOW_DAY = true
