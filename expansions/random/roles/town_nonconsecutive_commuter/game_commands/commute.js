// Register heal

var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	var from = game.getPlayerById(message.author.id)

	if (from.misc.consecutive_night === true) {
		message.channel.send(":x:  You may not use an action on two consecutive nights!")

		return null
	}

	var already_commuting = actions.exists(
		(x) => x.from === from.identifier && x.identifier === "town_nonconsecutive_commuter/commute"
	)

	if (already_commuting) {
		message.channel.send(
			":x:  You have already selected to commute tonight! Use `" +
				config["command-prefix"] +
				"deselect` to choose not to commute tonight."
		)
		return null
	}

	message.channel.send(":camping:  You have now selected to commute tonight.")

	actions.delete((x) => x.from === from.identifier && x.identifier === "town_nonconsecutive_commuter/no_action")

	game.addAction("town_nonconsecutive_commuter/commute", ["cycle"], {
		name: "Commuter-commute",
		expiry: 1,
		from: message.author.id,
		to: message.author.id,
	})
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
