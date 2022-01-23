import { RoleActionable } from "../../../../../systems/actionables"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const investigate: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Alignment-Cop-investigate",
		type: "investigate",
	})

	await game.addAction("alignment_cop/gather", ["cycle"], {
		name: "Alignment-Cop-gather",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: ActionPriorities.INVESTIGATE_RESULT,
	})
}

investigate.TAGS = ["roleblockable", "drivable", "visit"]

export default investigate
