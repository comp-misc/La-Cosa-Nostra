var auxils = require("../../../../../systems/auxils")

module.exports = function (actionable, game) {
	var dead_replaceable = game.exists((x) => x.role.tags.includes("deputy_replaceable") && !x.isAlive())

	if (!dead_replaceable) {
		return null
	}

	var replaceable = game.findAll((x) => x.role.tags.includes("deputy_replaceable") && !x.isAlive())

	var role_to_replace = auxils.cryptographicChoice(replaceable)

	// Promote the player to Mafioso
	var player = game.getPlayerByIdentifier(actionable.to)

	player.changeRole(role_to_replace.role_identifier)
	game.addMessage(player, ":exclamation: You have been promoted! Your role is now **" + player.getRole() + "**.")

	return true
}