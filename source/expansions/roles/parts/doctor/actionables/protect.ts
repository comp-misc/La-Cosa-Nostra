import { RoleActionable } from "../../../../../systems/actionables"

const protect: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Doctor-visit",
		type: "protect",
	})

	const target = game.getPlayerByIdentifierOrThrow(actionable.to)
	await target.addAttribute("protection", 1, { amount: 1 })
}

protect.TAGS = ["drivable", "roleblockable", "visit"]

export default protect
