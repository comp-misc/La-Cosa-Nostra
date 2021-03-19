// Register heal

var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "douse <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete(
			(x) =>
				x.from === from.identifier &&
				(x.identifier === "mafia_pyromaniac/douse" || x.identifier === "mafia_pyromaniac/ignite")
		)

		message.channel.send(":oil:  You have now selected to not douse nor ignite tonight.")
		game
			.getChannel("mafia")
			.send(":oil:  **" + from.getDisplayName() + "** is not dousing anyone nor igniting tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot vote to douse a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot vote to douse yourself!")

		return null
	} else {
		actions.delete(
			(x) =>
				x.from === from.identifier &&
				(x.identifier === "mafia_pyromaniac/douse" || x.identifier === "mafia_pyromaniac/ignite")
		)

		game.addAction("mafia_pyromaniac/douse", ["cycle"], {
			name: "Pyromaniac-douse",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":oil:  You have now selecting to douse **" + mention + "** tonight.")
	game.getChannel("mafia").send(":oil:  **" + from.getDisplayName() + "** is dousing **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
