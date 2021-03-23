// Register heal

var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "poison <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_poisoner/poison")

		message.channel.send(":test_tube:  You have now selected to not poison anyone tonight.")
		game.getChannel("mafia").send(":test_tube:  **" + from.getDisplayName() + "** is not poisoning anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot poison a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot poison yourself!")

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_poisoner/poison")

		game.addAction("mafia_poisoner/poison", ["cycle"], {
			name: "Toxicologist-poison",
			expiry: 1,
			from,
			to,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":test_tube:  You have now selected to poison **" + mention + "** tonight.")
	game
		.getChannel("mafia")
		.send(":test_tube:  **" + from.getDisplayName() + "** is poisoning **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false