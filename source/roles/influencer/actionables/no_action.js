var rs = require("../../../rolesystem/rolesystem")
var auxils = require("../../../systems/auxils")

module.exports = function (actionable, game, params) {
	var influencer = game.getPlayerByIdentifier(actionable.from)

	influencer.misc.influencer_log.unshift(null)

	return true
}
