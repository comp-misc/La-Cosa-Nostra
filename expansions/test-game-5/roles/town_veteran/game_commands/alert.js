// Register heal

var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	var from = game.getPlayerById(message.author.id)

	if (from.misc.veteran_alerts_left < 1) {
		message.channel.send(":x: You do not have any alerts left!")
		return null
	}

	var already_alerting = actions.exists((x) => x.from === from.identifier && x.identifier === "town_veteran/alert")

	if (already_alerting) {
		message.channel.send(
			":x: You have already decided to go on alert tonight! Use `" +
				config["command-prefix"] +
				"deselect` to not go on alert tonight!"
		)
		return null
	}

	message.channel.send(":triangular_flag_on_post: You have decided to go on alert tonight.")

	game.addAction("town_veteran/alert", ["cycle"], {
		name: "Veteran-alert",
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
