var mafia = require("../../../../../source/lcn.js")

var rs = mafia.rolesystem

var auxils = mafia.auxils

module.exports = function (actionable, game, params) {
	var influencer = game.getPlayerByIdentifier(actionable.from)

	influencer.misc.influencer_log.unshift(null)

	return true
}
