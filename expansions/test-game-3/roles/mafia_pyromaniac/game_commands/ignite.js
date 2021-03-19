// Register heal

var mafia = require("../../../../../source/lcn.js")

var rs = mafia.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	var from = game.getPlayerById(message.author.id)

	actions.delete(
		(x) =>
			x.from === from.identifier &&
			(x.identifier === "mafia_pyromaniac/douse" || x.identifier === "mafia_pyromaniac/ignite")
	)

	message.channel.send(":fire: You have decided to ignite tonight.")
	game.getChannel("mafia").send(":exclamation: **" + from.getDisplayName() + "** has decided to ignite tonight.")

	/*Ignition runs at a much higher priority
  - this is to allow Firefighter to possibly extinguish target
  first */

	game.addAction("mafia_pyromaniac/ignite", ["cycle"], {
		name: "Pyromaniac-ignition",
		expiry: 1,
		from: message.author.id,
		to: message.author.id,
		priority: 8,
	})
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
