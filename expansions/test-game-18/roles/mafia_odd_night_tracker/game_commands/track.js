var lcn = require("../../../../../source/lcn")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	if (game.getPeriod() % 4 !== 1) {
		message.channel.send(":x: You may only track on odd nights!")

		return null
	}

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "track <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_odd_night_tracker/track")

		message.channel.send(":mag: You have decided not to track anyone tonight.")
		game
			.getChannel("mafia")
			.send(":exclamation: **" + from.getDisplayName() + "** has decided not to track anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot track a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x: You cannot track yourself!" + rs.misc.sarcasm(true))

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_odd_night_tracker/track")

		game.addAction("mafia_odd_night_tracker/track", ["cycle"], {
			name: "Tracker-track",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":mag: You have decided to track **" + mention + "** tonight.")
	game
		.getChannel("mafia")
		.send(":exclamation: **" + from.getDisplayName() + "** has decided to track **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
