import { RoleActionable } from "../../../../../systems/actionables"

const target_killed: RoleActionable = (actionable, game) => {
	// Suicide==

	// Remove assassination
	game.actions.delete((x) => x.to === actionable.to && x.identifier === "assassin/assassination")

	const player = game.getPlayerByIdOrThrow(actionable.from)
	player.misc.assassin_picked_target = false
	player.misc.assassin_target = null

	// Destroy this instance
	return true
}

export = target_killed
