var mafia = require("../../../../../lcn")

var rs = mafia.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "choose <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_oracle/choose")

		message.channel.send(":eye_in_speech_bubble: You have decided not to choose anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot choose a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x: You cannot choose yourself!" + rs.misc.sarcasm(true))

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_oracle/choose")

		game.addAction("town_oracle/choose", ["cycle"], {
			name: "Oracle-choose",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":eye_in_speech_bubble: You have decided to choose **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false