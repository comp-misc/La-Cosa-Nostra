var mafia = require("../../../../../source/lcn")

var rs = mafia.rolesystem

var auxils = mafia.auxils

module.exports = function (actionable, game, params) {
	var social_engineer = game.getPlayerByIdentifier(actionable.from)

	social_engineer.misc.se_influence_log.unshift(null)

	return true
}
