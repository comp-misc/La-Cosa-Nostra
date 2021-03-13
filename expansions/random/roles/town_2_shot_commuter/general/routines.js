var lcn = require("../../../../../source/lcn.js")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.commutes_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":camping:  You may commute **" +
				player.misc.commutes_left +
				"** more time" +
				auxils.vocab("s", player.misc.commutes_left) +
				".\n\nUse `" +
				config["command-prefix"] +
				"commute` to choose to commute and `" +
				config["command-prefix"] +
				"deselect` to choose not to commute."
		)
	} else {
		player.game.sendPeriodPin(channel, ":camping:  You have run out of commutes.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
