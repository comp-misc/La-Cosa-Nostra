var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

var auxils = lcn.auxils

module.exports = function (actionable, game, params) {
	var social_engineer = game.getPlayerByIdentifier(actionable.from)

	social_engineer.misc.se_influence_log.unshift(null)

	return true
}
