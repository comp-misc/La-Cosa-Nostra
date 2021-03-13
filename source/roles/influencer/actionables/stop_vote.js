var rs = require("../../../rolesystem/rolesystem")
var auxils = require("../../../systems/auxils")

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)

	target.setGameStat("vote-magnitude", 0, "set")

	return true
}
