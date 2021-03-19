var lcn = require("../../../../../source/lcn.js")

module.exports = function (actionable, game, params) {
	// Seen as a visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Lawyer-frame",
	})

	var target = game.getPlayerByIdentifier(actionable.to)
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
