var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem
var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.to)
	var from = game.getPlayerByIdentifier(actionable.from)

	target.setGameStat("vote-magnitude", 0, "set")

	return true
}
