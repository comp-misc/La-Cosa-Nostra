var lcn = require("../../../../../lcn")

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.from)

	// Check if exists
	var investigating = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "town_1_shot_firefighter/extinguish"
	)
	var previously_roleblocked = player.getStatus("roleblocked")

	if (investigating && !previously_roleblocked) {
		game.addMessage(player, ":fire_engine: Your action was blocked last night. It was not consumed.")
	}
}