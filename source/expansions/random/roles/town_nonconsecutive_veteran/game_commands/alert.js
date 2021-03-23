// Register heal

var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	var from = game.getPlayerById(message.author.id)

	if (from.misc.consecutive_night === true) {
		message.channel.send(":x:  You may not use an action on two consecutive nights!")

		return null
	}

	var already_alerting = actions.exists(
		(x) => x.from === from.identifier && x.identifier === "town_nonconsecutive_veteran/alert"
	)

	if (already_alerting) {
		message.channel.send(
			":x:  You have already selected to be alert tonight! Use `" +
				config["command-prefix"] +
				"deselect` to not be alert tonight!"
		)
		return null
	}

	message.channel.send(":triangular_flag_on_post:  You have now selected to be alert tonight.")

	actions.delete((x) => x.from === from.identifier && x.identifier === "town_nonconsecutive_veteran/no_action")

	game.addAction("town_nonconsecutive_veteran/alert", ["cycle"], {
		name: "Veteran-alert",
		expiry: 1,
		from,
		to: from,
	})
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
