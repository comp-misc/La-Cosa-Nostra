import { RoleActionable } from "../../../../../systems/actionables"

const pick_target: RoleActionable = (actionable, game) => {
	// Counted as visiting self
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.from,
		priority: actionable.priority,
		reason: "Assassin-pick-target",
	})

	const assassin = game.getPlayerByIdentifierOrThrow(actionable.from)

	// If Assassin is killed
	game.addAction("assassin/assassination", ["killed"], {
		name: "Assassin-pick-target",
		expiry: Infinity,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.to),
		target: game.getPlayerOrThrow(actionable.from),
		tags: ["permanent"],
	})

	// If target is killed
	game.addAction("assassin/target_killed", ["killed"], {
		name: "Assassin-target-killed",
		expiry: Infinity,
		from: game.getPlayerOrThrow(actionable.to),
		to: game.getPlayerOrThrow(actionable.from),
		target: game.getPlayerOrThrow(actionable.to),
		tags: ["permanent"],
	})

	assassin.misc.assassin_picked_target = true
	assassin.misc.assassin_target = actionable.to
}

pick_target.TAGS = ["drivable", "roleblockable", "visit"]

export = pick_target
