var lcn = require("../../../../../source/lcn")

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.from)

	// Check if exists
	var investigating = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "town_nonconsecutive_kidnapper/kidnap"
	)
	var previously_roleblocked = player.getStatus("roleblocked")

	if (investigating && !previously_roleblocked) {
		game.addMessage(player, ":no_entry_sign:  Your action was blocked. You may use an action next night.")
	}

	player.misc.consecutive_night = false
}
