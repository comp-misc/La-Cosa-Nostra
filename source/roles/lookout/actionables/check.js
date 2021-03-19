var rs = require("../../../rolesystem/rolesystem.js")
var auxils = require("../../../systems/auxils.js")

module.exports = function (actionable, game, params) {
	// Visit the target
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Lookout-check",
	})

	game.addAction("lookout/gather", ["cycle"], {
		name: "Lookout-gather",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
		priority: 12,
	})
}

module.exports.TAGS = ["roleblockable", "drivable", "visit"]
