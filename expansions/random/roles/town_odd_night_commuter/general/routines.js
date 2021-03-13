var lcn = require("../../../../../source/lcn")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.game.getPeriod() % 4 === 1) {
		player.game.sendPeriodPin(
			channel,
			":camping:  You may choose to commute tonight.\n\nUse `" +
				config["command-prefix"] +
				"commute` to choose to commute and `" +
				config["command-prefix"] +
				"deselect` to choose not to commute."
		)
	} else {
		player.game.sendPeriodPin(channel, ":camping:  You may not commute tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
