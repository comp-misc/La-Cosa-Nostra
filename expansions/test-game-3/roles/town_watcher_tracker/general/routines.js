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
		":door: You may pick a player to see tonight. Use `" +
			config["command-prefix"] +
			"see <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false