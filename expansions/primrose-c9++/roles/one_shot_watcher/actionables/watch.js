var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	// Visit the target
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Watcher-watch",
	})

	game.addAction("one_shot_watcher/gather", ["cycle"], {
		name: "watcher-gather",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
		priority: 12,
	})

	var watcher = game.getPlayerByIdentifier(actionable.from)

	watcher.misc.watches_left--
}

module.exports.TAGS = ["roleblockable", "drivable", "visit"]
