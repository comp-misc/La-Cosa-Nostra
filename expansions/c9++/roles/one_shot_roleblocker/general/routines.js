var lcn = require("../../../../../source/lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	if (player.misc.roleblocks_left < 1) {
		return null
	}

	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.sendPeriodPin(
		channel,
		":no_entry_sign: You may roleblock a player tonight.\n\nUse `" +
			config["command-prefix"] +
			"roleblock <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
