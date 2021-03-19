var mafia = require("../../../../../source/lcn.js")

var rs = mafia.rolesystem

var auxils = mafia.auxils

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)

	target.setGameStat("vote-magnitude", 2, auxils.operations.multiplication)

	return true
}
