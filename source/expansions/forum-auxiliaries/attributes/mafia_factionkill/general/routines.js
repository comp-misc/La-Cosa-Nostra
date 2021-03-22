// Routines
// Runs every cycle

module.exports = async (player) => {
	const config = player.game.config

	// Nighttime actions
	const channel = player.getPrivateChannel()

	await player.game.sendPeriodPin(
		channel,
		":no_entry: You may kill a player tonight using the faction kill.\n\nUse `" +
			config["command-prefix"] +
			"kill <alphabet/name/nobody>` to select your target."
	)
}

module.exports.ALLOW_DEAD = false
module.exports.ALLOW_NIGHT = true
module.exports.ALLOW_DAY = false
