// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	var addendum = player.misc.oracle_last_target
		? "Your latest chosen target is **" +
		  player.game.getPlayerByIdentifier(player.misc.oracle_last_target).getDisplayName() +
		  "**."
		: "You currently do not have a target."

	if (player.game.getPeriod() % 4 === 3) {
		player.game.sendPeriodPin(
			channel,
			":pen_fountain:  You may select a player tonight.\n\nUse `" +
				config["command-prefix"] +
				"select <alphabet/name/nobody>` to select your target.\n\n" +
				addendum
		)
	} else {
		player.game.sendPeriodPin(channel, ":pen_fountain:  You may not select a player tonight.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
