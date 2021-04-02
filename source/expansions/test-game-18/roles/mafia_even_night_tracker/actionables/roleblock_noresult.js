var lcn = require("../../../../../lcn")

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.from)

	// Check if exists
	var tracking = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "mafia_even_night_tracker/track"
	)
	var previously_roleblocked = player.getStatus("roleblocked")

	if (tracking && !previously_roleblocked) {
		game.addMessage(player, ":mag: You got __No Result__.")
	}
}