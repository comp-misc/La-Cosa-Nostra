// Register heal

var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "interrogate <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (from.misc.interrogates_left < 1) {
		message.channel.send(":x:  You have no uses left!")
		return null
	}

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_1_shot_interrogator/interrogate")

		message.channel.send(":chair:  You have now selected to not interrogate anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot interrogate a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot interrogate yourself!")

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_1_shot_interrogator/interrogate")

		game.addAction("town_1_shot_interrogator/interrogate", ["cycle"], {
			name: "Sheriff-interrogation",
			expiry: 1,
			from,
			to,
			target: to,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":chair:  You have now selected to interrogate **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = false
module.exports.DISALLOW_NIGHT = true
