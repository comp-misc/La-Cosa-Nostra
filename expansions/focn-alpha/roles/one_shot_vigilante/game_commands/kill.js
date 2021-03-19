var lcn = require("../../../../../source/lcn.js")

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

	if (from.misc.kills_left < 1) {
		message.channel.send(":x: You have no kills left!")
		return null
	}

	var to = game.getPlayerMatch(params[0])

	actions.delete((x) => x.from === from.identifier && x.identifier === "one_shot_vigilante/kill")

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
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
		game.addAction("one_shot_vigilante/kill", ["cycle"], {
			name: "Vigilante-kill",
			expiry: 1,
			from: message.author.id,
			to: to.id,
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
