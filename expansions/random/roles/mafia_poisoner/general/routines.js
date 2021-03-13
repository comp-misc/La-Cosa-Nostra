// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.sendPeriodPin(
		channel,
		":test_tube:  You may choose to poison a player tonight.\n\nUse `" +
			config["command-prefix"] +
			"poison <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
