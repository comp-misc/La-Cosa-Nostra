module.exports = function (actionable, game) {
	// Seen as visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Oracle-choose",
	})

	var oracle = game.getPlayerByIdentifier(actionable.from)

	oracle.misc.oracle_last_target = actionable.to
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
