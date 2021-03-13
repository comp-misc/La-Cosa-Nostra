// Routines
// Runs every cycle

// Function should be synchronous

var lcn = require("../../../../../source/lcn")

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.cupid_matches > 0) {
		player.game.sendPeriodPin(
			channel,
			":bow_and_arrow:  You may choose to match two players tonight.\n\nUse `" +
				config["command-prefix"] +
				"match <alphabet/name/nobody> <alphabet/name>` to select your targets.\n\nYou currently have " +
				player.misc.cupid_matches +
				" match" +
				auxils.vocab("es", player.misc.cupid_matches) +
				" left."
		)
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
