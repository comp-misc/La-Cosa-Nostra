var lcn = require("../../../../../lcn")

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

	game.addAction("town_even_night_observer/gather", ["cycle"], {
		name: "God-of-doors-gather",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
		priority: 12,
	})
}

module.exports.TAGS = ["roleblockable", "drivable", "visit"]