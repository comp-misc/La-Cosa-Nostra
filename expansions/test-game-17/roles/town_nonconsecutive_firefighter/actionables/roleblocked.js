var lcn = require("../../../../../source/lcn.js")

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.from)

	// Check if exists
	var investigating = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "town_nonconsecutive_firefighter/extinguish"
	)
	var previously_roleblocked = player.getStatus("roleblocked")

	if (investigating && !previously_roleblocked) {
		game.addMessage(player, ":fire_engine: Your action was blocked last night. You may use an action the next night.")
	}

	player.misc.consecutive_night = false
}
