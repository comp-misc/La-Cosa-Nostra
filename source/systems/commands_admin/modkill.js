module.exports = async function (message, params, config) {
	var game = process.timer.game

	if (!process.timer || !["pre-game", "playing"].includes(process.timer.game.state)) {
		await message.channel.send(":x: No game going on.")
		return null
	}

	var config = game.config

	if (params.length !== 1) {
		await message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "modkill <id>` instead!")
		return null
	}

	var id = params[0]

	var response = game.modkill(id)

	var player = game.getPlayerById(id).identifier

	player = game.getPlayerByIdentifier(player)

	if (response) {
		await message.channel.send(":ok:  Modkilled **" + player.getDisplayName() + "**!")

		player.misc.time_of_death = game.getPeriod() + 0.05
	} else {
		await message.channel.send(":x:  Could not modkill player.")
	}
}
