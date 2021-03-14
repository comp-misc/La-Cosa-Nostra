var lcn = require("../../../../../lcn")

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.from)

	// Check if exists
	var tracking = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "town_odd_night_lazy_tracker/track"
	)
	var previously_roleblocked = player.getStatus("roleblocked")

	if (tracking && !previously_roleblocked) {
		game.addMessage(player, ":no_entry_sign:  Your action was blocked. You got no result.")
	}
}