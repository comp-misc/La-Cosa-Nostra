var mafia = require("../../../../../source/lcn")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	// Send visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Compulsive-Visitor-visit",
	})
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
