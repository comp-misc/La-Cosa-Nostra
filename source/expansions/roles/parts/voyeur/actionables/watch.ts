import { RoleActionable } from "../../../../../systems/actionables"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const watch: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Voyeur-watch",
		type: "watch",
	})

	await game.addAction("voyeur/gather", ["cycle"], {
		name: "Voyeur-gather",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: ActionPriorities.INVESTIGATE_RESULT,
	})
}

watch.TAGS = ["roleblockable", "drivable", "visit"]

export default watch
