var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Self-visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Arsonist-ignition",
	})

	// Get all ignited players
	var doused = game.findAll((x) => x.misc.doused === true && x.isAlive())

	for (var i = 0; i < doused.length; i++) {
		var outcome = rs.prototypes.unstoppableAttack(
			{ to: doused[i].identifier, from: actionable.from, tags: ["astral"] },
			game,
			params,
			true
		)
	}
}

module.exports.TAGS = ["roleblockable", "visit"]