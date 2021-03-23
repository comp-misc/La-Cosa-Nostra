var lcn = require("../../../../../lcn")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (game.getPeriod() % 4 !== 3) {
		return null
	}

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "shoot <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	actions.delete((x) => x.from === from.identifier && x.identifier === "even_night_vigilante/shoot")

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		message.channel.send(":gun: You have decided not to shoot anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot shoot a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x: You cannot shoot yourself!" + rs.misc.sarcasm(true))

		return null
	} else {
		game.addAction("even_night_vigilante/shoot", ["cycle"], {
			name: "ENV-shoot",
			expiry: 1,
			from,
			to,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":gun: You have decided to shoot **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false