// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../../../lcn")

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.sendPeriodPin(
		channel,
		":mag: You may choose to investigate a player tonight.\n\nUse `" +
			config["command-prefix"] +
			"investigate <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false