import rs from "../../../../../rolesystem/rolesystem"
import { RoleActionable } from "../../../../../systems/actionables"
import { Actionable } from "../../../../../systems/game_templates/Actions"

const ignite: RoleActionable = (actionable, game, params) => {
	// Self-visit
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Arsonist-ignition",
	})

	// Get all ignited players
	const doused = game.findAll((x) => x.misc.doused === true && x.isAlive())

	for (let i = 0; i < doused.length; i++) {
		rs.prototypes.unstoppableAttack.reason = "annihilated in an __Arsonist__'s fire"
		const outcome = rs.prototypes.unstoppableAttack(
			//Slightly hacky, but only a few of the fields are actually used in the unstoppableAttack prototype
			{ to: doused[i].identifier, from: actionable.from, tags: ["astral"] } as Actionable<unknown>,
			game,
			params,
			true
		)

		if (!outcome) {
			game.addMessage(doused[i], ":exclamation: " + doused[i].getDisplayName() + " survived the fire!")
		}
	}
}

ignite.TAGS = ["roleblockable", "visit"]

export = ignite
