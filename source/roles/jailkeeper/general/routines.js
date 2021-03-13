// Routines
// Runs every cycle

// Function should be synchronous

var auxils = require("../../../systems/auxils.js")

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.sendPeriodPin(
		channel,
		":police_car: You may jail a player tonight.\n\nUse `" +
			config["command-prefix"] +
			"jail <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
