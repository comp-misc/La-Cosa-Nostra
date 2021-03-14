// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.deflector_deflections_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":magnet:  You may choose to redirect actions performed on your first target onto your second target tonight.\n\nYou have **" +
				player.misc.deflector_deflections_left +
				"** deflect action" +
				auxils.vocab("s", player.misc.deflector_deflections_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"deflect <alphabet/name/nobody> <alphabet/name/nobody>` to select your targets respectively."
		)
	} else {
		player.game.sendPeriodPin(channel, ":magnet:  You have run out of redirects.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false