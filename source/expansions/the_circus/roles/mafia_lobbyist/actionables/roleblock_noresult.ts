import { RoleActionable } from "../../../../../systems/actionables"

const roleblock_noresult: RoleActionable = (actionable, game) => {
	const player = game.getPlayerByIdentifierOrThrow(actionable.from)

	// Check if exists
	const investigating = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "mafia_lobbyist/bribe"
	)
	const previously_roleblocked = player.getStatus("roleblocked")

	if (investigating && !previously_roleblocked) {
		game.addMessage(player, ":no_entry_sign:  Your action was blocked.")
	}
}

export default roleblock_noresult
