import { RoleActionable } from "../../../../../systems/actionables"

const roleblock_noresult: RoleActionable = (actionable, game) => {
	const player = game.getPlayerOrThrow(actionable.from)

	// Check if exists
	const tracking = game.actions.exists((x) => x.from === player.identifier && x.identifier === "tracker/track")
	const previously_roleblocked = player.getStatus("roleblocked")

	if (tracking && !previously_roleblocked) {
		game.addMessage(player, ":mag: You got __No Result__.")
	}
}

export default roleblock_noresult
