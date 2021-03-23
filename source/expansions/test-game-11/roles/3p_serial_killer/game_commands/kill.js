var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	var from = game.getPlayerById(message.author.id)

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "kill <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "3p_serial_killer/kill")

		message.channel.send(":no_entry: You have decided not to kill anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot kill a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x: You cannot shoot yourself!" + rs.misc.sarcasm(true))

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "3p_serial_killer/kill")

		game.addAction("3p_serial_killer/kill", ["cycle"], {
			name: "SK-kill",
			expiry: 1,
			from,
			to,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":no_entry: You have decided to kill **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false