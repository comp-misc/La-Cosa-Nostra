// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn")

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

	player.game.sendPeriodPin(
		channel,
		":pen_fountain:  You may select a player tonight.\n\nUse `" +
			config["command-prefix"] +
			"select <alphabet/name/nobody>` to select your target.\n\n" +
			addendum
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
