// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../lcn")

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

	player.game.addAction("town_nonconsecutive_oracle/no_action", ["cycle"], {
		name: "SE-no_action",
		expiry: 1,
		from: player,
		to: player,
	})

	if (player.misc.consecutive_night === false) {
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