var lcn = require("../../../../../lcn")

module.exports = function (actionable, game, params) {
	// Seen as a visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Lawyer-frame",
	})

	var target = game.getPlayerByIdentifier(actionable.to)
	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.lawyer_frames_left--
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]