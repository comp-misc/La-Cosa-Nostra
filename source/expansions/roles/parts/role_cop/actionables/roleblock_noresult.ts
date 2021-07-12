import { RoleActionable } from "../../../../../systems/actionables"

const roleblock_noresult: RoleActionable = (actionable, game) => {
	const player = game.getPlayerByIdentifierOrThrow(actionable.from)

	// Check if exists
	const investigating = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "role_cop/investigate"
	)
	const previously_roleblocked = player.getStatus("roleblocked")

	if (investigating && !previously_roleblocked) {
		game.addMessage(player, ":no_entry_sign:  Your action was blocked. You got no result.")
	}
}

export default roleblock_noresult
