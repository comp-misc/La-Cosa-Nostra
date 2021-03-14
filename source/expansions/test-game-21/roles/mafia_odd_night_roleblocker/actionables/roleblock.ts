import { RoleActionable } from "../../../../../systems/actionables"

const roleblock: RoleActionable = (actionable, game) => {
	const target = game.getPlayerByIdentifierOrThrow(actionable.to)

	// Considered as visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Mafia-Roleblocker-visit",
	})

	game.execute("roleblock", {
		roleblocker: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Mafia-Roleblocker-roleblock",
	})

	const immunity = target.getStat("roleblock-immunity", Math.max)

	if (immunity < 1) {
		game.actions.delete((x) => x.from === target.identifier && x.tags.includes("roleblockable"))
		target.setStatus("roleblocked", true)
	}
}

roleblock.TAGS = ["drivable", "visit"]

export = roleblock