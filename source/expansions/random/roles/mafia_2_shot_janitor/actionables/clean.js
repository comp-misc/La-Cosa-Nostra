var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Janitor-clean",
	})

	game.addAction("mafia_2_shot_janitor/clean_role", ["killed"], {
		name: "Janitor-clean-role",
		expiry: 2,
		from: actionable.from,
		to: actionable.to,
		attack: actionable.target,
		priority: 4,
	})

	var cleaner = game.getPlayerByIdentifier(actionable.from)

	cleaner.misc.janitor_cleans_left--
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]