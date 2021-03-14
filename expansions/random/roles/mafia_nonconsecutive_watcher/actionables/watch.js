var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	// Astral
	game.addAction("mafia_nonconsecutive_watcher/gather", ["cycle"], {
		name: "watcher-gather",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
		priority: 12,
	})

	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.consecutive_night = true
}

module.exports.TAGS = ["roleblockable", "drivable", "visit"]