var lcn = require("../../../../../source/lcn.js")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (game.getPeriod() % 4 !== 1) {
		message.channel.send(":x:  You may only jail on even nights!")

		return null
	}

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "jail <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_odd_night_jailkeeper/jail")

		message.channel.send(":european_castle:  You have now selected to not jail anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot jail a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot jail yourself!")

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_odd_night_jailkeeper/jail")

		game.addAction("town_odd_night_jailkeeper/jail", ["cycle"], {
			name: "Jailkeeper-jail",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":european_castle:  You have now selected to jail **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
