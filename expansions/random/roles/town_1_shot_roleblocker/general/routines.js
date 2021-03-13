var lcn = require("../../../../../source/lcn.js")

// Routines
// Runs every cycle

// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.roleblocker_roleblocks_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":no_entry_sign:  You may roleblock a player tonight.\n\nYou have " +
				player.misc.roleblocker_roleblocks_left +
				" roleblock" +
				auxils.vocab("s", player.misc.roleblocker_roleblocks_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"roleblock <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":no_entry_sign:  You have run out of roleblocks.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
