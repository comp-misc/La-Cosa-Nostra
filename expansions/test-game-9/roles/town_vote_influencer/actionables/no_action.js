var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var influencer = game.getPlayerByIdentifier(actionable.from)

	influencer.misc.influencer_log.unshift(null)

	return true
}
