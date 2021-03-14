var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	game.execute("visit", {
		name: "Town-Jailkeeper-visit",
		from: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
	})

	game.addAction("town_nonconsecutive_jailkeeper/roleblock", ["cycle"], {
		name: "Roleblocker-roleblock",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
	})

	game.addAction("town_nonconsecutive_jailkeeper/protect", ["cycle"], {
		name: "Doc-protect",
		expiry: 1,
		from: actionable.from,
		to: actionable.to,
	})

	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.consecutive_night = true
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]