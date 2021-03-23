import { RoleActionable } from "../../../../../systems/actionables"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"

const watch: RoleActionable = (actionable, game, params) => {
	// Visit the target
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Modular-visit",
	})

	game.addAction("a/ability_watch/gather", ["cycle"], {
		name: "Modular-gather",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: 12,
	})

	attributeDecrement(actionable, game, params)
}

watch.TAGS = ["roleblockable", "drivable", "visit"]

export default watch
