var lcn = require("../../../../../lcn")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "roleblock <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	actions.delete(
		(x) =>
			x.from === from.identifier &&
			(x.identifier === "epi_escort/roleblock" || x.identifier === "epi_escort/random_roleblock")
	)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		message.channel.send(
			":wine_glass: You have decided not to roleblock anyone tonight. A random player will be chosen and roleblocked."
		)

		game.addAction("epi_escort/random_roleblock", ["cycle"], {
			name: "Escort-random-roleblock",
			expiry: 1,
			from: message.author.id,
			to: message.author.id,
			priority: -1,
		})

		return null
	}

	to = to.player

	if (from.misc.visit_log.includes(to.identifier)) {
		message.channel.send(
			":wine_glass: You have visited that player before. A random player will be chosen and roleblocked instead unless you resubmit your action."
		)

		game.addAction("epi_escort/random_roleblock", ["cycle"], {
			name: "Escort-random-roleblock",
			expiry: 1,
			from: message.author.id,
			to: message.author.id,
			priority: -1,
		})

		return null
	}

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot roleblock a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x: You cannot roleblock yourself!" + rs.misc.sarcasm(true))

		return null
	} else {
		game.addAction("epi_escort/roleblock", ["cycle"], {
			name: "Escort-roleblock",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":wine_glass: You have decided to roleblock **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false