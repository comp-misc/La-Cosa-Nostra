var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions

	// Run checks, etc

	if (game.getPeriod() % 4 !== 3) {
		message.channel.send(":x: You may only extinguish on even nights!")

		return null
	}

	if (params[0] === undefined) {
		message.channel.send(
			":x: Wrong syntax! Please use `" + config["command-prefix"] + "extinguish <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_even_night_firefighter/extinguish")

		message.channel.send(":fire_engine: You have decided to extinguish nobody tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x: You cannot extinguish a dead player!" + rs.misc.sarcasm(true))
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":fire_engine: You have decided to extinguish **yourself** tonight.")

		actions.delete((x) => x.from === from.identifier && x.identifier === "town_even_night_firefighter/extinguish")

		game.addAction("town_even_night_firefighter/extinguish", ["cycle"], {
			name: "Firefighter-extinguish",
			expiry: 1,
			from: message.author.id,
			to: to.id,
		})
	} else {
		message.channel.send(":fire_engine: You have decided to extinguish **" + to.getDisplayName() + "** tonight.")
	}

	actions.delete((x) => x.from === from.identifier && x.identifier === "town_even_night_firefighter/extinguish")

	game.addAction("town_even_night_firefighter/extinguish", ["cycle"], {
		name: "Firefighter-extinguish",
		expiry: 1,
		from: message.author.id,
		to: to.id,
	})
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
