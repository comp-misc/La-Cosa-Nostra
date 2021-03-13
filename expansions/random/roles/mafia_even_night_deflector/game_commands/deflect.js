// Register heal

var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	if (game.getPeriod() % 4 !== 3) {
		message.channel.send(":x:  You may only redirect actions from a player on even nights!")

		return null
	}

	// Run checks, etc

	var from = game.getPlayerById(message.author.id)

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" +
				config["command-prefix"] +
				"deflect <alphabet/name/nobody> <alphabet/name>` instead!"
		)
		return null
	}

	var player1 = game.getPlayerMatch(params[0])

	if (player1.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_even_night_deflector/deflect")

		message.channel.send(":magnet:  You have now selected to not deflect actions from anyone tonight.")
		game
			.getChannel("mafia")
			.send(":magnet:  **" + from.getDisplayName() + "** is not deflecting actions from anyone tonight.")
		return null
	}

	player1 = player1.player

	if (params[1] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" +
				config["command-prefix"] +
				"deflect <alphabet/name/nobody> <alphabet/name>` instead!"
		)
		return null
	}

	var player2 = game.getPlayerMatch(params[1])

	if (player2.score < 0.7) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" +
				config["command-prefix"] +
				"deflect <alphabet/name/nobody> <alphabet/name>` instead!"
		)
		return null
	}

	player2 = player2.player

	if (!player1.isAlive() || !player2.isAlive()) {
		message.channel.send(":x:  Both your targets have to be alive!")
		return null
	}

	if (player1.identifier === player2.identifier) {
		message.channel.send(":x:  Your targets cannot be the same player!")
		return null
	}

	actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_even_night_deflector/deflect")

	game.addAction("mafia_even_night_deflector/deflect", ["cycle"], {
		name: "Driver-drive",
		expiry: 1,
		from: message.author.id,
		to: player1.identifier,
		target: player2.identifier,
	})

	var p1_name = player1.identifier === from.identifier ? "yourself" : player1.getDisplayName()
	var p2_name = player2.identifier === from.identifier ? "yourself" : player2.getDisplayName()

	message.channel.send(
		":magnet:  You have now selected to deflect actions performed on **" +
			p1_name +
			"** to **" +
			p2_name +
			"** tonight."
	)
	game
		.getChannel("mafia")
		.send(
			":magnet:  **" +
				from.getDisplayName() +
				"** is deflecting actions performed on **" +
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
