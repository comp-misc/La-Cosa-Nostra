var lcn = require("../../../../../source/lcn.js")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	if (game.getPeriod() % 4 !== 1) {
		message.channel.send(":x:  You may only clean the body of a dead player on odd nights!")

		return null
	}

	// Run checks, etc

	var from = game.getPlayerById(message.author.id)

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "clean <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_odd_night_janitor/clean")

		message.channel.send(":drop_of_blood:  You have now selected to not clean anyone tonight.")
		game.getChannel("mafia").send(":drop_of_blood:  **" + from.getDisplayName() + "** is not cleaning anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot clean a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		var mention = "yourself"
	} else {
		var mention = to.getDisplayName()
	}

	actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_odd_night_janitor/clean")

	game.addAction("mafia_odd_night_janitor/clean", ["cycle"], {
		name: "Janitor-clean",
		expiry: 1,
		from: message.author.id,
		to: to.id,
	})

	message.channel.send(":drop_of_blood:  You have now selected to clean **" + mention + "** tonight.")
	game
		.getChannel("mafia")
		.send(
			":drop_of_blood:  **" +
				from.getDisplayName() +
				"** is cleaning **" +
				mention +
				"** tonight. The factional kill needs to be used in addition to the clean action."
		)
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
