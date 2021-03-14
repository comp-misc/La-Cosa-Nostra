var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.consecutive_night = false

	return true
}