var lcn = require("../../../../../lcn")

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.from)

	// Check if exists
	var investigating = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "town_neapolitan/investigate"
	)
	var previously_roleblocked = player.getStatus("roleblocked")

	if (investigating && !previously_roleblocked) {
		game.addMessage(player, ":mag: You got __No Result__.")
	}
}