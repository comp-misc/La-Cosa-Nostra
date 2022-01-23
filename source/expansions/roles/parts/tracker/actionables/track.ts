import { RoleActionable } from "../../../../../systems/actionables"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const track: RoleActionable = async (actionable, game) => {
	// Visit the target
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Tracker-track",
		type: "track",
	})

	await game.addAction("tracker/gather", ["cycle"], {
		name: "Tracker-gather",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: ActionPriorities.INVESTIGATE_RESULT,
	})
}

track.TAGS = ["roleblockable", "drivable", "visit"]

export default track
