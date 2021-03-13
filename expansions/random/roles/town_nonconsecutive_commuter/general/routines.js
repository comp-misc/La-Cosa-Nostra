var lcn = require("../../../../../source/lcn.js")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.addAction("town_nonconsecutive_commuter/no_action", ["cycle"], {
		name: "SE-no_action",
		expiry: 1,
		from: player,
		to: player,
	})

	if (player.misc.consecutive_night === false) {
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
