var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var influencer = game.getPlayerByIdentifier(actionable.from)

	influencer.misc.consecutive_night = false

	return true
}