var lcn = require("../../../../../lcn")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "powercopy <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	rs.modular.clearModuleActions(game, from.identifier, "power")

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		message.channel.send(":arrow_up_down: You have not to copy powers tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot copy the powers of a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x: You cannot copy your own powers!" + rs.misc.sarcasm(true))

		return null
	} else {
		game.addAction("a/power_power_copy/powercopy", ["cycle"], {
			name: "Modular-power-copy",
			expiry: 1,
			from: message.author.id,
			meta: { type: "power" },
			to: to.id,
			priority: 7,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":arrow_up_down: You have decided to copy the powers of **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false