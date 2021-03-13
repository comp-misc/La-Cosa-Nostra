var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Janitor-clean",
	})

	game.addAction("mafia_nonconsecutive_janitor/clean_role", ["killed"], {
		name: "Janitor-clean-role",
		expiry: 2,
		from: actionable.from,
		to: actionable.to,
		attack: actionable.target,
		priority: 4,
	})

	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.consecutive_night = true
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
