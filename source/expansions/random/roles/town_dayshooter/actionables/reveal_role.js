var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.from)
	target.clearDisplayRole()
}