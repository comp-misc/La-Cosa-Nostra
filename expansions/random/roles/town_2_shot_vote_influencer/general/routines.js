// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.vote_influencer_influences_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":bookmark:  You may choose to double a player's vote strength or null it for tomorrow.\n\nYou have **" +
				player.misc.vote_influencer_influences_left +
				"** use" +
				auxils.vocab("s", player.misc.vote_influencer_influences_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"influence <alphabet/name/nobody>` to double the vote strength of your selected target.\nUse `" +
				config["command-prefix"] +
				"block <alphabet/name/nobody>` to null the vote of your selected target.\n\nYou may only do either action."
		)
	} else {
		player.game.sendPeriodPin(channel, ":bookmark:  You have run out of uses.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
