var lcn = require("../../../../../source/lcn.js")

// Register heal

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "kill <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete(
			(x) =>
				(x.from === from.identifier && x.tags.includes("mafia_factional_side")) ||
				x.tags.includes("mafia_factional_main")
		)

		message.channel.send("| :dagger: | You have now selected the factional kill not to be used tonight.")
		game
			.getChannel("mafia")
			.send("| :dagger: |  **" + from.getDisplayName() + "** has selected the factional kill not to be used tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot kill a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":x:  You cannot kill yourself!" + rs.misc.sarcasm(true))

		return null
	} else {
		actions.delete(
			(x) =>
				(x.from === from.identifier && x.tags.includes("mafia_factional_side")) ||
				x.tags.includes("mafia_factional_main")
		)

		game.addAction("a/mafia_factionkill/kill", ["cycle"], {
			name: "Factionkill-kill",
			expiry: 1,
			priority: 6,
			from: message.author.id,
			to: to.id,
			tags: ["mafia_factional_main"],
		})

		var mention = to.getDisplayName()
	}

	message.channel.send("| :dagger: |  You have now selected to use the factional kill on **" + mention + "** tonight.")
	game
		.getChannel("mafia")
		.send("| :dagger: |  **" + from.getDisplayName() + "** is using the factional kill on **" + mention + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
