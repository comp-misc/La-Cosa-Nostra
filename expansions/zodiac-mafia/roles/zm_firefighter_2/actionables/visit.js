var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Send visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "zm_firefighter_2-visit",
	})
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
