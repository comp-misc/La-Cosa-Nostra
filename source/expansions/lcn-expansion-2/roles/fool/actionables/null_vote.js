var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)

	target.setGameStat("vote-magnitude", 0, "set")

	return true
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]