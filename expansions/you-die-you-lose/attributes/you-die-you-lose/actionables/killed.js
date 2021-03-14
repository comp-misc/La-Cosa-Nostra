var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Set loss

	var player = game.getPlayerByIdentifier(actionable.from)

	player.setStatus("canWin", false)

	return true
}