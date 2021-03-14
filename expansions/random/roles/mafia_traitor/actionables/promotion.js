var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Check if XK roles left
	var primary_left = game.exists((x) => x.role.tags.includes("primary_mafia_killer") && x.isAlive())

	if (primary_left) {
		return null
	}

	// Promote the player to Mafioso
	var player = game.getPlayerByIdentifier(actionable.to)

	if (!player.isAlive()) {
		return true
	}

	player.changeRole("mafia_goon")
	game.addMessage(player, ":exclamation: You have been promoted to a __Mafia Goon__!")

	return true
}