var lcn = require("../../../../../source/lcn")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "guard <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (from.misc.bodyguard_guards_left < 1) {
		message.channel.send(":x:  You have no uses left!")
		return null
	}

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_2_shot_bodyguard/guard")

		message.channel.send(":shield:  You have now selected to not guard anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x: You  cannot guard a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x: You  cannot guard yourself!")

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_2_shot_bodyguard/guard")

		game.addAction("town_2_shot_bodyguard/guard", ["cycle"], {
			name: "Bodyguard-guard",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":shield:  You have now selected to guard **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
