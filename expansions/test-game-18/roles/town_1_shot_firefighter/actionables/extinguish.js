var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Send visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Firefighter-visit",
	})

	// Remove douse
	var extinguisher = game.getPlayerByIdentifier(actionable.from)
	var target = game.getPlayerByIdentifier(actionable.to)

	if (target.misc.doused === true) {
		target.misc.doused = false

		// Is doused
		game.addMessage(extinguisher, ":exclamation: You managed to remove gasoline from your target!")
		game.addMessage(target, ":exclamation: Someone extinguished you last night and removed gasoline from you!")
	}

	extinguisher.misc.firefighter_extinguishes_left--
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
