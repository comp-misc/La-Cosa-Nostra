var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		name: "Mafia-Jailkeeper-visit",
		from: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
	})

	game.addAction("mafia_1_shot_jailkeeper/roleblock", ["cycle"], {
		name: "Roleblocker-roleblock",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
	})

	game.addAction("mafia_1_shot_jailkeeper/protect", ["cycle"], {
		name: "Doc-protect",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
	})

	var from = game.getPlayerByIdentifier(actionable.from)

	from.jailkeeper_jails_left--
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
