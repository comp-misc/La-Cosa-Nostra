var rs = require("../../../rolesystem/rolesystem")
var auxils = require("../../../systems/auxils")

module.exports = function (actionable, game, params) {
	var social_engineer = game.getPlayerByIdentifier(actionable.from)

	social_engineer.misc.se_influence_log.unshift(null)

	return true
}
