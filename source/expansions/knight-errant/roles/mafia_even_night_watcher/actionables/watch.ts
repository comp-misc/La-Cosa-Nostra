import { RoleActionable } from "../../../../../systems/actionables"

const watch: RoleActionable = async (actionable, game) => {
	// Visit the target
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Watcher-watch",
	})

	await game.addAction("mafia_even_night_watcher/gather", ["cycle"], {
		name: "watcher-gather",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		priority: 12,
	})
}

watch.TAGS = ["roleblockable", "drivable", "visit"]

export default watch
