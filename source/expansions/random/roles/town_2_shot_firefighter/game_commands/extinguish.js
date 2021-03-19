var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "extinguish <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])
	var from = game.getPlayerById(message.author.id)

	if (from.misc.firefighter_extinguishes_left < 1) {
		message.channel.send(":x:  You have no uses left!")
		return null
	}

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete((x) => x.from === from.identifier && x.identifier === "town_2_shot_firefighter/extinguish")

		message.channel.send(":fire_extinguisher:  You have now selected to not extinguish anyone tonight.")
		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot extinguish a dead player!")
		return null
	}

	if (to.id === message.author.id) {
		message.channel.send(":fire_extinguisher:  You have now selected to extinguish **yourself** tonight.")
	} else {
		message.channel.send(
			":fire_extinguisher:  You have now selected to extinguish **" + to.getDisplayName() + "** tonight."
		)
	}

	actions.delete((x) => x.from === from.identifier && x.identifier === "town_2_shot_firefighter/extinguish")

	game.addAction("town_2_shot_firefighter/extinguish", ["cycle"], {
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