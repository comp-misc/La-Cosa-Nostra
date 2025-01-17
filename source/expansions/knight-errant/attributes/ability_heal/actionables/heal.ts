import { RoleActionable } from "../../../../../systems/actionables"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"

const heal: RoleActionable = async (actionable, game, params) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Modular-visit",
	})

	const target = game.getPlayerOrThrow(actionable.to)

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

	await attributeDecrement(actionable, game, params)
}

heal.TAGS = ["drivable", "roleblockable", "visit"]

export default heal
