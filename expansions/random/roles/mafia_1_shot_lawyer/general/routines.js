// Routines
// Runs every cycle
var lcn = require("../../../../../source/lcn.js")
// Function should be synchronous

var auxils = lcn.auxils

module.exports = function (player) {
	var config = player.game.config

	// Nighttime actions
	var channel = player.getPrivateChannel()

	if (player.misc.lawyer_frames_left > 0) {
		player.game.sendPeriodPin(
			channel,
			":gloves:  You may choose to frame a player tonight.\n\n You have **" +
				player.misc.lawyer_frames_left +
				"** frame" +
				auxils.vocab("s", player.misc.lawyer_frames_left) +
				" left.\n\nUse `" +
				config["command-prefix"] +
				"frame <alphabet/name/nobody>` to select your target."
		)
	} else {
		player.game.sendPeriodPin(channel, ":gloves:  You have run out of frames.")
	}
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
