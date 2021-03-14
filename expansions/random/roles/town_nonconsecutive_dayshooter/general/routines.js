// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	player.game.addAction("town_nonconsecutive_dayshooter/no_action", ["cycle"], {
		name: "SE-no_action",
		expiry: 1,
		from: player,
		to: player,
	})

	if (player.misc.consecutive_day === false) {
		player.game.sendPeriodPin(
			channel,
			":gun:  You may choose to shoot a player today.\n\nUse `" +
				config["command-prefix"] +
				"shoot <alphabet/name/nobody>` to select your target.\n\nThis action is irreversible."
		)
	} else {
		player.game.sendPeriodPin(channel, ":gun:  You may not shoot a player today.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = false
module.exports.ALLOW_DAY = true