// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.apothecarist_poisons_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":test_tube:  You may choose to poison a player tonight.\n\nYou have **" +
				player.misc.apothecarist_poisons_left +
				"** poison" +
				auxils.vocab("s", player.misc.apothecarist_poisons_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"poison <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":test_tube:  You have run out of poisons.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false