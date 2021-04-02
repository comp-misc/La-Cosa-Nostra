var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Veteran seen as self-visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Veteran-self-visit",
	})

	// Increase immunity
	//  ----- rs.prototypes.basicDefense(...arguments);

	// Add killing action
	game.addAction("town_even_night_veteran/kill_visitors", ["retrovisit"], {
		name: "Veteran-kill-visitors",
		expiry: 1,
		from: actionable.from,
		to: actionable.from,
		priority: 10,
	})

	var veteran = game.getPlayerByIdentifier(actionable.from)
}

module.exports.TAGS = ["roleblockable", "visit"]