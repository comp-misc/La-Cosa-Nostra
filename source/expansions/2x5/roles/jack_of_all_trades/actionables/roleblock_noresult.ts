import { RoleActionable } from "../../../../../systems/actionables"

const roleblockNoResult: RoleActionable = (actionable, game) => {
	const player = game.getPlayerOrThrow(actionable.from)

	// Check if exists
	const tracking = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier.startsWith("jack_of_all_trades/")
	)
	const previously_roleblocked = player.getStatus("roleblocked")

	if (tracking && !previously_roleblocked) {
		game.addMessage(player, ":no_entry_sign:  Your action was blocked.")
	}
}

export default roleblockNoResult
