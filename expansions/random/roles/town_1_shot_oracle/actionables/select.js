var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var from = game.getPlayerByIdentifier(actionable.from)

	// Seen as visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Oracle-choose",
	})

	var oracle = game.getPlayerByIdentifier(actionable.from)

	oracle.misc.oracle_last_target = actionable.to

	from.misc.oracle_selects_left--
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
