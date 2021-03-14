var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Seen as a visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "SE-double-vote",
	})

	game.addAction("mafia_odd_night_vote_influencer/double_vote", ["postcycle"], {
		name: "SE-double-vote",
		expiry: 2,
		from: actionable.from,
		to: actionable.to,
	})

	var social_engineer = game.getPlayerByIdentifier(actionable.from)
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]