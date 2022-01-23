import { RoleActionable } from "../../../../../systems/actionables"

const protect: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Bodyguard-bodyguard",
		type: "bodyguard",
	})

	const killAction = game.actions.find((action) => action.identifier.endsWith("/kill") && action.to === actionable.to)
	if (killAction) {
		killAction.to = actionable.from
	}
}

protect.TAGS = ["drivable", "roleblockable", "visit"]

export default protect
