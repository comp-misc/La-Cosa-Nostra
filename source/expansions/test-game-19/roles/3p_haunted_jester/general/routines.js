// Routines
// Runs every cycle

// Function should be synchronous

module.exports = function (player) {
	var config = player.game.config

	// Check if the player has fulfilled lynch requirements
	if (!player.misc.haunted_jester_haunted && player.misc.haunted_jester_lynched && !player.isAlive()) {
		// Nighttime actions
		var channel = player.getPrivateChannel()

		player.game.sendPeriodPin(
			channel,
			":ghost:  You are forced to haunt a player who voted you in the trial tonight.\n\nUse `" +
				config["command-prefix"] +
				"haunt <alphabet/name/nobody>` to select your target.\n\nIf you do not choose an individual, one will be selected at random."
		)

		player.game.addAction("3p_haunted_jester/random_haunt", ["cycle"], {
			name: "Jester-random-haunt",
			expiry: 1,
			from: player.identifier,
			to: player.identifier,
			priority: -1,
		})
	}
}

module.exports.ALLOW_DEAD = true
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
