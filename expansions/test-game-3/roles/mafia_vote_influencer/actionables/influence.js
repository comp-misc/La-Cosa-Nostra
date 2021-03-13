var mafia = require("../../../../../source/lcn")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	// Seen as a visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "SE-double-vote",
	})

	game.addAction("mafia_vote_influencer/double_vote", ["postcycle"], {
		name: "SE-double-vote",
		expiry: 2,
		from: actionable.from,
		to: actionable.to,
	})

	var social_engineer = game.getPlayerByIdentifier(actionable.from)

	social_engineer.misc.se_influence_log.unshift(actionable.to)
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
