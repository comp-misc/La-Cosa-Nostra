var mafia = require("../../../../../lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = mafia.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.sendPeriodPin(
		channel,
		":no_entry_sign: You may roleblock a player tonight instead of using the factional kill.\n\nUse `" +
			config["command-prefix"] +
			"roleblock <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false