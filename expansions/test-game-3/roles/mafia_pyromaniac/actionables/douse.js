var mafia = require("../../../../../source/lcn")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Pyromaniac-douse",
	})

	var doused = game.getPlayerByIdentifier(actionable.to)

	doused.misc.doused = true
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
