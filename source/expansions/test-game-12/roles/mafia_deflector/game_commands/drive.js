// Register heal

var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	var from = game.getPlayerById(message.author.id)

	if (from.misc.driver_drives_left < 1) {
		message.channel.send(":x: You have no more drives left!")
		return null
	}

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" +
				config["command-prefix"] +
				"drive <alphabet/name/nobody> <alphabet/name>` instead!"
		)
		return null
	}

	var player1 = game.getPlayerMatch(params[0])

	if (player1.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_deflector/drive")

		message.channel.send(":bus: You have decided not to deflect performed on someone to anyone else tonight.")
		game
			.getChannel("mafia")
			.send(
				":exclamation: **" +
					from.getDisplayName() +
					"** has decided not to deflect actions performed on someone to anyone else tonight."
			)
		return null
	}

	player1 = player1.player

	if (params[1] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" +
				config["command-prefix"] +
				"drive <alphabet/name/nobody> <alphabet/name>` instead!"
		)
		return null
	}

	var player2 = game.getPlayerMatch(params[1])

	if (player2.score < 0.7) {
		message.channel.send(
			":x: Wrong syntax! Please use `" +
				config["command-prefix"] +
				"drive <alphabet/name/nobody> <alphabet/name>` instead!"
		)
		return null
	}

	player2 = player2.player

	if (!player1.isAlive() || !player2.isAlive()) {
		message.channel.send(":x: Both your targets have to be alive!")
		return null
	}

	if (player1.identifier === player2.identifier) {
		message.channel.send(":x: Your targets cannot be the same player!")
		return null
	}

	actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_deflector/drive")

	game.addAction("mafia_deflector/drive", ["cycle"], {
		name: "Driver-drive",
		expiry: 1,
		from,
		to: player1,
		target: player2,
	})

	var p1_name = player1.identifier === from.identifier ? "yourself" : player1.getDisplayName()
	var p2_name = player2.identifier === from.identifier ? "yourself" : player2.getDisplayName()

	message.channel.send(
		":bus: You have decided to deflect actions performed on **" + p1_name + "** to **" + p2_name + "** tonight."
	)
	game
		.getChannel("mafia")
		.send(
			":exclamation: **" +
				from.getDisplayName() +
				"** has decided to deflect action performed on **" +
				p1_name +
				"** to **" +
				p2_name +
				"** tonight."
		)
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
