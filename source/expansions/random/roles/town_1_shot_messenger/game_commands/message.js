// Register heal

var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "shoot <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (from.misc.messenger_messages_left < 1) {
		message.channel.send(":x:  You have no uses left!")
		return null
	}

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_1_shot_messenger/message")

		message.channel.send(":envelope:  You have now selected to not message anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot send a message to a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot send a message to yourself!")

		return null
	} else {
		if (params.length < 2) {
			message.channel.send(":x:  You cannot send an empty message!")
			return null
		}

		var send = params.splice(1, Infinity).join(" ")

		if (/`/g.test(send)) {
			message.channel.send(":x:  Please do not use code formatting in the anonymous message!")
			return null
		}

		send = send.trim().replace(/^\s+|\s+$/g, "")

		if (send.length > 1200) {
			message.channel.send(":x:  The message cannot exceed 1,200 characters!")
			return null
		}

		actions.delete((x) => x.from === from.identifier && x.identifier === "town_1_shot_messenger/message")

		game.addAction("town_1_shot_messenger/message", ["cycle"], {
			name: "Mailman-mail",
			expiry: 1,
			from,
			to,
			message: send,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(
		":envelope:  You have now selected to send **" + mention + "** the following anonymous message:\n```" + send + "```"
	)
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false