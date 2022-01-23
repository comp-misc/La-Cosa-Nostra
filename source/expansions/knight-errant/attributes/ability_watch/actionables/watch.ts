import { RoleActionable } from "../../../../../systems/actionables"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const watch: RoleActionable = async (actionable, game, params) => {
	// Visit the target
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Modular-visit",
	})

	await game.addAction("a/ability_watch/gather", ["cycle"], {
		name: "Modular-gather",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: ActionPriorities.INVESTIGATE_RESULT,
	})

	await attributeDecrement(actionable, game, params)
}

watch.TAGS = ["roleblockable", "drivable", "visit"]

export default watch
