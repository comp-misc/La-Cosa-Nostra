var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var from = game.getPlayerByIdentifier(actionable.from)

	game.execute("visit", {
		name: "Town-Jailkeeper-visit",
		from: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
	})

	game.addAction("town_2_shot_jailkeeper/roleblock", ["cycle"], {
		name: "Roleblocker-roleblock",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
	})

	game.addAction("town_2_shot_jailkeeper/protect", ["cycle"], {
		name: "Doc-protect",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
	})

	from.misc.jailkeeper_jails_left--
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
