var lcn = require("../../../../../lcn")

// Register heal

var rs = lcn.rolesystem

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
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "jail <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete(
			(x) =>
				x.from === from.identifier &&
				(x.identifier === "mafia_nonconsecutive_jailkeeper/jail" ||
					x.identifier === "mafia_nonconsecutive_jailkeeper/no_action")
		)

		player.game.addAction("mafia_nonconsecutive_jailkeeper/no_action", ["cycle"], {
			name: "SE-no_action",
			expiry: 1,
			from: player,
			to: player,
		})

		message.channel.send(":european_castle:  You have now selected to not jail anyone tonight.")
		game.getChannel("mafia").send(":european_castle:  **" + from.getDisplayName() + "** is not jailing anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot jail a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot jail yourself!" + rs.misc.sarcasm(true))

		return null
	} else {
		actions.delete(
			(x) =>
				x.from === from.identifier &&
				(x.identifier === "mafia_nonconsecutive_jailkeeper/jail" ||
					x.identifier === "mafia_nonconsecutive_jailkeeper/no_action")
		)

		game.addAction("mafia_nonconsecutive_jailkeeper/jail", ["cycle"], {
			name: "Jailkeeper-jail",
			expiry: 1,
			from,
			to,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":european_castle:  You have now selected to jail **" + mention + "** tonight.")
	game
		.getChannel("mafia")
		.send(":exclamation: **" + from.getDisplayName() + "** is jailing **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false