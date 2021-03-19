import { RoleActionable } from "../../../../../systems/actionables"

const douse: RoleActionable = (actionable, game) => {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Arsonist-douse",
	})

	const doused = game.getPlayerByIdentifierOrThrow(actionable.to)
	doused.misc.doused = true
}

douse.TAGS = ["drivable", "roleblockable", "visit"]

export = douse
