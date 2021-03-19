var lcn = require("../../../../../source/lcn.js")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	if (game.getPeriod() % 4 !== 3) {
		message.channel.send(":x:  You may only investigate a player on even nights!")

		return null
	}

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "investigate <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_even_night_neapolitan/investigate")

		message.channel.send(":mag_right:  You have now selected to not investigate anyone tonight.")
		game.getChannel("mafia").send(":mag_right:  **" + from.getDisplayName() + "** is not investigating anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot investigate a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot investigate yourself!")

		return null
	} else {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_even_night_neapolitan/investigate")

		game.addAction("mafia_even_night_neapolitan/investigate", ["cycle"], {
			name: "Neapolitan-investigation",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})

		var mention = to.getDisplayName()
	}

	message.channel.send(":mag_right:  You have now selected to investigate **" + mention + "** tonight.")
	game
		.getChannel("mafia")
		.send(":mag_right:  **" + from.getDisplayName() + "** is investigating **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
