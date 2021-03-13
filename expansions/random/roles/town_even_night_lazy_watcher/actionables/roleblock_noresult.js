var lcn = require("../../../../../source/lcn.js")

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.from)

	// Check if exists
	var watching = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "town_even_night_lazy_watcher/watch"
	)
	var previously_roleblocked = player.getStatus("roleblocked")

	if (watching && !previously_roleblocked) {
		game.addMessage(player, ":no_entry_sign:  Your action was blocked. You got no result.")
	}
}
