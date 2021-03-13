var lcn = require("../../../../../source/lcn")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "protect <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_doctor_full_prot/protect")

		message.channel.send(":shield: You have decided to protect nobody tonight.")
		game
			.getChannel("mafia")
			.send(":exclamation: **" + from.getDisplayName() + "** has decided not to protect anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot heal a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x: You may not protect yourself.")
		return null
	}

	actions.delete((x) => x.from === from.identifier && x.identifier === "mafia_doctor_full_prot/protect")

	game.addAction("mafia_doctor_full_prot/protect", ["cycle"], {
		name: "Doc-protect",
		expiry: 1,
		from: message.author.id,
		to: to.id,
	})

	var mention = to.getDisplayName()

	message.channel.send(":shield: You have decided to protect **" + mention + "** tonight.")
	game
		.getChannel("mafia")
		.send(":exclamation: **" + from.getDisplayName() + "** is protecting **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
