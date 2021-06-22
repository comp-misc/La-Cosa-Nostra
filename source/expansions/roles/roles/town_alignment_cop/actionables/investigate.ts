import { RoleActionable } from "../../../../../systems/actionables"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const watch: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Alignment-Cop-Investigate",
		type: "investigate",
	})

	await game.addAction("town_alignment_cop/gather", ["cycle"], {
		name: "town-alignment-cop-investigate",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: ActionPriorities.LOWEST,
	})
}

watch.TAGS = ["roleblockable", "drivable", "visit"]

export default watch
