// Register heal

var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	if (game.getPeriod() % 4 !== 2) {
		message.channel.send(":x:  You may only interrogate on odd days!")

		return null
	}

	// Run checks, etc

	var from = game.getPlayerById(message.author.id)

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "shoot <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		message.channel.send(":gun:  You have now selected to not shoot anyone.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot shoot a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot shoot yourself!")

		return null
	} else {
		game.addAction("town_odd_day_dayshooter/shoot", ["instant"], {
			name: "Dayshooter-shoot",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = false
module.exports.DISALLOW_NIGHT = true
