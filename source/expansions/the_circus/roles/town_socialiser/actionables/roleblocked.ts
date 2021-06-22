import { RoleActionable } from "../../../../../systems/actionables"

const roleblock_noresult: RoleActionable = (actionable, game) => {
	const player = game.getPlayerByIdentifierOrThrow(actionable.from)

	// Check if exists
	const investigating = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "town_socialiser/invite"
	)
	const previously_roleblocked = player.getStatus("roleblocked")

	if (investigating && !previously_roleblocked) {
		game.addMessage(player, ":no_entry_sign: You were blocked")
	}
}

export default roleblock_noresult
