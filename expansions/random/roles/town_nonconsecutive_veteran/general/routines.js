// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.addAction("town_nonconsecutive_veteran/no_action", ["cycle"], {
		name: "SE-no_action",
		expiry: 1,
		from: player,
		to: player,
	})

	if (player.misc.consecutive_night === false) {
		player.game.sendPeriodPin(
			channel,
			":triangular_flag_on_post:  You may choose to go on alert tonight.\n\nUse `" +
				config["command-prefix"] +
				"alert` to go on alert and `" +
				config["command-prefix"] +
				"deselect` to choose not to go on alert."
		)
	} else {
		player.game.sendPeriodPin(channel, ":triangular_flag_on_post:  You may not go on alert tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
