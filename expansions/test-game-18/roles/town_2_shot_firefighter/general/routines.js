// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.firefighter_extinguishes_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":fire_engine: You may choose to extinguish a player tonight.\n\nUse `" +
				config["command-prefix"] +
				"extinguish <alphabet/name/nobody>` to select your target. You have " +
				player.misc.firefighter_extinguishes_left +
				" extinguishes left."
		)
	} else {
		player.game.sendPeriodPin(channel, ":fire_engine: You have run out of extinguishes.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
