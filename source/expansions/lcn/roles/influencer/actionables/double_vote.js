var auxils = require("../../../../../systems/auxils")

module.exports = function (actionable, game) {
	var target = game.getPlayerByIdentifier(actionable.to)

	target.setGameStat("vote-magnitude", 2, auxils.operations.multiplication)

	return true
}
