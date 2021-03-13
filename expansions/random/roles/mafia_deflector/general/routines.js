// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.sendPeriodPin(
		channel,
		":magnet:  You may choose to redirect actions performed on your first target onto your second target tonight.\n\nUse `" +
			config["command-prefix"] +
			"deflect <alphabet/name/nobody> <alphabet/name/nobody>` to select your targets respectively."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
