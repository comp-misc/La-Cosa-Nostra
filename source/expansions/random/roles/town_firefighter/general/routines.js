// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.sendPeriodPin(
		channel,
		":fire_extinguisher:  You may choose to extinguish a player tonight.\n\nUse `" +
			config["command-prefix"] +
			"extinguish <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false