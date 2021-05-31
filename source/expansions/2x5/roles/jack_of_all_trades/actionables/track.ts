import { RoleActionable } from "../../../../../systems/actionables"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const track: RoleActionable = async (actionable, game) => {
	// Visit the target
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Jack-of-all-trades-track",
		type: "track",
	})

	await game.addAction("jack_of_all_trades/gather", ["cycle"], {
		name: "Jack-of-all-trades-gather",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: ActionPriorities.LOWEST,
	})
}

track.TAGS = ["roleblockable", "drivable", "visit"]

export default track
