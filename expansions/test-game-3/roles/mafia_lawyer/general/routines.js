// Routines
// Runs every cycle
var mafia = require("../../../../../source/lcn")
// Function should be synchronous

var auxils = mafia.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.sendPeriodPin(
		channel,
		":scales: You may choose to frame a player tonight.\n\nUse `" +
			config["command-prefix"] +
			"frame <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
