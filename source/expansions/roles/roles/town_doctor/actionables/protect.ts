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

	/*
  target.misc.protections ? target.misc.protections++ : target.misc.protections = 1;

  // Add message
  game.addAction("doctor/single_protection", ["attacked"], {
    name: "Doc-single-protection",
    from: actionable.from,
    to: actionable.to,
    expiry: 1,
    priority: 1
  });*/

	await target.addAttribute("protection", 1, { amount: 1 })
}

protect.TAGS = ["drivable", "roleblockable", "visit"]

export default protect
