import { RoleActionable } from "../../../../../systems/actionables"

const roleblock: RoleActionable = async (actionable, game) => {
	const target = game.getPlayerOrThrow(actionable.to)

	// Considered as visit
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Jack-of-All-Trades-visit",
		type: "roleblock",
	})

	await game.execute("roleblock", {
		roleblocker: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Jack-of-All-Trades-roleblock",
	})

	const immunity = target.getStat("roleblock-immunity", Math.max)

	if (immunity < 1) {
		game.actions.delete((x) => x.from === target.identifier && x.tags.includes("roleblockable"))
		target.setStatus("roleblocked", true)
	}
}

roleblock.TAGS = ["drivable", "visit"]

export default roleblock
