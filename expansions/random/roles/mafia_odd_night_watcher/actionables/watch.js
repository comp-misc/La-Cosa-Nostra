var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	// Astral
	game.addAction("mafia_odd_night_watcher/gather", ["cycle"], {
		name: "watcher-gather",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
		priority: 12,
	})
}

module.exports.TAGS = ["roleblockable", "drivable", "visit"]
