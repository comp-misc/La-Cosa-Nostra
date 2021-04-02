import { RoleActionable } from "../../../../../systems/actionables"

const track: RoleActionable = (actionable, game) => {
	// Visit the target
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Tracker-track",
	})

	game.addAction("town_tracker/gather", ["cycle"], {
		name: "Tracker-gather",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: 12,
	})
}

track.TAGS = ["roleblockable", "drivable", "visit"]

export default track
