var lcn = require("../../../../../source/lcn")

module.exports = function (actionable, game, params) {
	var player = game.getPlayerByIdentifier(actionable.from)

	// Check if exists
	var investigating = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "mafia_2_shot_jailkeeper/jail"
	)
	var previously_roleblocked = player.getStatus("roleblocked")

	if (investigating && !previously_roleblocked) {
		game.addMessage(player, ":no_entry_sign:  Your action was blocked last night. It was not consumed.")
	}
}
