var lcn = require("../../../../../lcn")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "jail <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	rs.modular.clearModuleActions(game, from.identifier, "power")

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		message.channel.send(":raised_back_of_hand: You have decided not to jail anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot jail a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":raised_back_of_hand: You cannot jail yourself!" + rs.misc.sarcasm(true))

		return null
	} else {
		game.addAction("a/power_jail/jail", ["cycle"], {
			name: "Modular-jail",
			expiry: 1,
			from,
			meta: { type: "power" },
			to,
			priority: 0.2,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":raised_back_of_hand: You have decided to jail **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false