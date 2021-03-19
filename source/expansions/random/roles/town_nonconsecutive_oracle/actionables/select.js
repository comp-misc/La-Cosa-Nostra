var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Seen as visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Oracle-choose",
	})

	var oracle = game.getPlayerByIdentifier(actionable.from)

	oracle.misc.oracle_last_target = actionable.to

	oracle.misc.consecutive_night = false
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]