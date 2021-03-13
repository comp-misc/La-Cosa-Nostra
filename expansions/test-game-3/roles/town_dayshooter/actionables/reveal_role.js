var mafia = require("../../../../../source/lcn")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.from)
	target.clearDisplayRole()
}
