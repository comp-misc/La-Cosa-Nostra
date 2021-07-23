import { RoleActionable } from "../../../../../systems/actionables"

const roleblocked: RoleActionable = async (actionable, game) => {
	const from = game.getPlayerByIdentifierOrThrow(actionable.from)

	// Check if exists
	const recruiting = game.actions.exists((x) => x.from === from.identifier && x.identifier === "recruiter/recruit")
	const previously_roleblocked = from.getStatus("roleblocked")

	if (recruiting && !previously_roleblocked) {
		game.addMessage(from, ":exclamation: The recruit failed.")
		await from.broadcastTargetMessage(":exclamation: The recruit failed.")
	}
}

export default roleblocked
