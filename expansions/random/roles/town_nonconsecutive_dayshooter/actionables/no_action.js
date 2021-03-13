var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.consecutive_day = false

	return true
}
