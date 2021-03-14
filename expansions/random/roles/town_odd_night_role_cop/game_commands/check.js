var lcn = require("../../../../../lcn")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	if (game.getPeriod() % 4 !== 1) {
		message.channel.send(":x:  You may only check a player on odd nights!")

		return null
	}

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "check <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_odd_night_role_cop/check")

		message.channel.send(":mag_right:  You have now selected to not check anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot check a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot check yourself!")

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_odd_night_role_cop/check")

		game.addAction("town_odd_night_role_cop/check", ["cycle"], {
			name: "Rolecop-check",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":mag_right:  You have now selected to check **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false