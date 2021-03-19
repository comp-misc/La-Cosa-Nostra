var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	// Visit the target
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "God-of-doors-watch",
	})

	game.addAction("town_1_shot_observer/gather", ["cycle"], {
		name: "God-of-doors-gather",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
		priority: 12,
	})

	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.observer_observes_left--
}

module.exports.TAGS = ["roleblockable", "drivable", "visit"]
