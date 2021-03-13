var lcn = require("../../../../../source/lcn")

// Register heal

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "visit <alphabet/username/nobody>` instead!"
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
			":homes:  You have now selected to not to visit anyone. As a result a random player will be selected."
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
		message.channel.send(":x:  You cannot visit yourself!")

		return null
	}

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot visit a dead player!")
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

	message.channel.send(":homes:  You have now selected to visit **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
