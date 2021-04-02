import { RoleActionable } from "../../../../../systems/actionables"

const roleblock_noresult: RoleActionable = (actionable, game) => {
	const player = game.getPlayerByIdentifierOrThrow(actionable.from)

	// Check if exists
	const investigating = game.actions.exists(
		(x) => x.from === player.identifier && x.identifier === "gunsmith/investigate"
	)
	const previously_roleblocked = player.getStatus("roleblocked")

	if (investigating && !previously_roleblocked) {
		game.addMessage(player, ":mag: You got __No Result__.")
	}
}

export default roleblock_noresult
