var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	// Visit the target
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Tracker-track",
	})

	game.addAction("mafia_nonconsecutive_tracker/gather", ["cycle"], {
		name: "Tracker-gather",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
		priority: 12,
	})

	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.consecutive_night = true
}

module.exports.TAGS = ["roleblockable", "drivable", "visit"]