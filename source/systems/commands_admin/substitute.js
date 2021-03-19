module.exports = async function (message, params, config) {
	if (!process.timer) {
		await message.channel.send(":x: No instance loaded.")
		return null
	}

	if (!process.timer.game.exists((x) => x.id === params[0])) {
		await message.channel.send(":x: Cannot find player to substitute!")
		return null
	}

	var game = process.timer.game

	await process.timer.game.substitute(params[0], params[1], true)

	if (game.isDay()) {
		game.__reloadTrialVoteMessage()
	}

	process.timer.game.save()

	await message.channel.send(":ok: Substitution complete (" + params[0] + " → " + params[1] + ").")
	await message.channel.send(
		":exclamation: Please ensure that the substituted player has correct access to all the channels."
	)
}
