import { RoleActionable } from "../../../../../systems/actionables"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const investigate: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Vanilla-Cop-investigate",
		type: "investigate",
	})

	await game.addAction("vanilla_cop/gather", ["cycle"], {
		name: "Vanilla-Cop-gather",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: ActionPriorities.LOWEST,
	})
}

investigate.TAGS = ["roleblockable", "drivable", "visit"]

export default investigate
