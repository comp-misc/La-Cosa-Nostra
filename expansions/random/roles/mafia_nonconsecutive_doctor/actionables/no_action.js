var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var from = game.getPlayerByIdentifier(actionable.from)

	from.misc.consecutive_night = false

	player.misc.consecutive_night = false

	return true
}
