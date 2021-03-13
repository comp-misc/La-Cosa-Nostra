// Register heal

var lcn = require("../../../../../source/lcn.js")

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	var from = game.getPlayerById(message.author.id)

	if (from.misc.consecutive_night === true) {
		message.channel.send(":x:  You may not use an action on two consecutive nights!")

		return null
	}

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "frame <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete(
			(x) =>
				x.from === from.identifier &&
				(x.identifier === "mafia_nonconsecutive_lawyer/frame" ||
					x.identifier === "mafia_nonconsecutive_lawyer/no_action")
		)

		game.addAction("mafia_nonconsecutive_lawyer/no_action", ["cycle"], {
			name: "SE-no_action",
			expiry: 1,
			from: message.author.id,
			to: message.author.id,
		})

		message.channel.send(":gloves:  You have now selected to not frame anyone tonight.")
		game.getChannel("mafia").send(":gloves:  **" + from.getDisplayName() + "** is not framing anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot frame a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot frame yourself!")

		return null
	} else {
		actions.delete(
			(x) =>
				x.from === from.identifier &&
				(x.identifier === "mafia_nonconsecutive_lawyer/frame" ||
					x.identifier === "mafia_nonconsecutive_lawyer/no_action")
		)

		game.addAction("mafia_nonconsecutive_lawyer/frame", ["cycle"], {
			name: "Lawyer-frame",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":gloves:  You have now selected to frame **" + mention + "** tonight.")
	game.getChannel("mafia").send(":gloves:  **" + from.getDisplayName() + "** is framing **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
