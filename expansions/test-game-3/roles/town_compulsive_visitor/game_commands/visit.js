var mafia = require("../../../../../source/lcn")

// Register heal

var rs = mafia.rolesystem
var auxils = mafia.auxils

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "visit <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete(
			(x) =>
				x.from === from.identifier &&
				(x.identifier === "town_compulsive_visitor/visit" || x.identifier === "town_compulsive_visitor/random_visit")
		)

		message.channel.send(
			":house_with_garden: You have decided not to visit anyone. A random player will be chosen and visited."
		)

		game.addAction("town_compulsive_visitor/random_visit", ["cycle"], {
			name: "Compulsive-Visitor-random-visit",
			expiry: 1,
			from: message.author.id,
			to: message.author.id,
			priority: -1,
		})

		return null
	}

	to = to.player

	if (to.id === message.author.id) {
		message.channel.send(":x: You cannot visit yourself!" + rs.misc.sarcasm(true))

		return null
	}

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot visit a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	actions.delete(
		(x) =>
			x.from === from.identifier &&
			(x.identifier === "town_compulsive_visitor/visit" || x.identifier === "town_compulsive_visitor/random_visit")
	)

	game.addAction("town_compulsive_visitor/visit", ["cycle"], {
		name: "Compulsive-Visitor-visit",
		expiry: 1,
		from: message.author.id,
		to: to.id,
	})

	var mention = to.getDisplayName()

	message.channel.send(":house_with_garden: You have decided to visit **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
