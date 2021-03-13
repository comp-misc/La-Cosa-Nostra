// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.game.getPeriod() % 4 === 1) {
		player.game.sendPeriodPin(
			channel,
			":magnet:  You may choose to redirect actions performed on your first target onto your second target tonight.\n\nUse `" +
				config["command-prefix"] +
				"deflect <alphabet/name/nobody> <alphabet/name/nobody>` to select your targets respectively."
		)
	} else {
		player.game.sendPeriodPin(channel, ":magnet:  You may not redirect actions performed on a player tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
