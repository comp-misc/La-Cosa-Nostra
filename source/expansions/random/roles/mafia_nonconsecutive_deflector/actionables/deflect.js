module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)
	var driver = game.getPlayerByIdentifier(actionable.from)

	// Considered as visit to player driven to
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.target,
		priority: actionable.priority,
		reason: "Driver-visit",
	})

	var drivables = game.actions.findAll((x) => x.tags.includes("drivable") && x.to === actionable.to)

	for (var i = 0; i < drivables.length; i++) {
		drivables[i].to = actionable.target
	}

	var player1 = game.getPlayerByIdentifier(actionable.to)
	var player2 = game.getPlayerByIdentifier(actionable.target)

	driver.misc.consecutive_night = true
}

module.exports.TAGS = ["roleblockable", "visit"]
