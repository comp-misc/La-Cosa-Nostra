import { RoleActionable } from "../../../../../systems/actionables"

const roleblocked: RoleActionable = (actionable, game) => {
	const from = game.getPlayerByIdentifierOrThrow(actionable.from)

	// Check if exists
	const recruiting = game.actions.exists(
		(x) => x.from === from.identifier && x.identifier === "interrogator/interrogate"
	)
	const previously_roleblocked = from.getStatus("roleblocked")

	if (recruiting && !previously_roleblocked) {
		game.addMessage(from, ":no_entry_sign: Your action was blocked.")
	}
}

export default roleblocked
