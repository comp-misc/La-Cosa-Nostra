var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var from = game.getPlayerByIdentifier(actionable.from)

	// Visit the target
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Watcher-watch",
	})

	game.addAction("town_2_shot_watcher/gather", ["cycle"], {
		name: "watcher-gather",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
		priority: 12,
	})

	from.misc.watcher_watches_left--
}

module.exports.TAGS = ["roleblockable", "drivable", "visit"]