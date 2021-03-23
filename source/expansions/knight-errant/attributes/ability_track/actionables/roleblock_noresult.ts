import { RoleActionable } from "../../../../../systems/actionables"

const roleblock_noresult: RoleActionable = (actionable, game) => {
	const player = game.getPlayerOrThrow(actionable.from)

	// Check if exists
	const watching = game.actions.exists((x) => x.from === player.identifier && x.identifier === "a/ability_track/watch")
	const previously_roleblocked = player.getStatus("roleblocked")

	if (watching && !previously_roleblocked) {
		game.addMessage(player, ":mag: You got __No Result__.")
	}
}

export default roleblock_noresult
