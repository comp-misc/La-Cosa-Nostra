var lcn = require("../../../../../source/lcn.js")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "roleblock <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (from.misc.roleblocker_roleblocks_left < 1) {
		message.channel.send(":x:  You have no uses left!")
		return null
	}

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_2_shot_roleblocker/roleblock")

		message.channel.send(":no_entry_sign:  You have now selected to not roleblock anyone tonight.")
		game
			.getChannel("mafia")
			.send(":no_entry_sign:  **" + from.getDisplayName() + "** is not roleblocking anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot roleblock a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot roleblock yourself!")

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_2_shot_roleblocker/roleblock")

		game.addAction("mafia_2_shot_roleblocker/roleblock", ["cycle"], {
			name: "Mafia-roleblocker-roleblock",
			expiry: 1,
			from: message.author.id,
			to: to.id,
			tags: ["mafia_factional_side"],
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":no_entry_sign:  You have now selected to roleblock **" + mention + "** tonight.")
	game
		.getChannel("mafia")
		.send(":no_entry_sign:  **" + from.getDisplayName() + "** is roleblocking **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
