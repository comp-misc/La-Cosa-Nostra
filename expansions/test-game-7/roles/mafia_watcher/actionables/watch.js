var mafia = require("../../../../../source/lcn")

var rs = mafia.rolesystem
var auxils = mafia.auxils

module.exports = function (actionable, game, params) {
	// Astral
	game.addAction("mafia_watcher/gather", ["cycle"], {
		name: "watcher-gather",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
		priority: 12,
	})
}

module.exports.TAGS = ["roleblockable", "drivable", "visit"]
