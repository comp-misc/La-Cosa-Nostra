var rs = require("../../../rolesystem/rolesystem")

module.exports = function (actionable, game, params) {
	var target = game.getPlayerByIdentifier(actionable.from)
	target.clearDisplayRole()
}
