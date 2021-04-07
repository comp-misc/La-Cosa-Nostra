import { RoleActionable } from "../../../../../systems/actionables"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"

const roleblock: RoleActionable = async (actionable, game, params) => {
	const target = game.getPlayerOrThrow(actionable.to)

	// Considered as visit
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Modular-visit",
	})

	await game.execute("roleblock", {
		roleblocker: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Modular-roleblock",
	})

	const immunity = target.getStat("roleblock-immunity", Math.max)

	if (immunity < 1) {
		// Delete all
		game.actions.delete((x) => x.from === target.identifier && x.tags.includes("roleblockable"))

		target.setStatus("roleblocked", true)
	}

	await attributeDecrement(actionable, game, params)
}

roleblock.TAGS = ["drivable", "visit"]

export default roleblock
