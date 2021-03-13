import { RoleActionable } from "../../../systems/actionables"

const promotion: RoleActionable = (actionable, game) => {
	// Check if XK roles left
	const primary_left = game.exists((x) => x.expandedRole().tags.includes("primary_mafia_killer") && x.isAlive())

	if (primary_left) {
		return
	}

	// Promote the player to Mafioso
	const player = game.getPlayerByIdentifierOrThrow(actionable.to)

	if (!player.isAlive()) {
		return true
	}

	player.changeRole("mafioso")
	game.addMessage(player, ":exclamation: You have been promoted to a __Mafioso__!")

	return true
}

export = promotion
