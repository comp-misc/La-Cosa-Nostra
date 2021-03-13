var lcn = require("../../../../../source/lcn")

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.from)

	// Check if exists
	var tracking = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "mafia_nonconsecutive_tracker/track"
	)
	var previously_roleblocked = player.getStatus("roleblocked")

	if (tracking && !previously_roleblocked) {
		game.addMessage(
			player,
			":no_entry_sign:  Your action was blocked and you got no result. You may use an action next night."
		)
	}

	player.misc.consecutive_night = false
}
