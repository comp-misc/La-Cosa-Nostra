import rs from "../../../rolesystem/rolesystem"
import { RoleActionable } from "../../../systems/actionables"

const assassination: RoleActionable = (actionable, game, params) => {
	const to = game.getPlayerByIdentifierOrThrow(actionable.to)
	const from = game.getPlayerByIdentifierOrThrow(actionable.from)

	/* No need to create a loop */
	game.actions.delete((x) => x.from === actionable.to && x.identifier === "assassin/target_killed")

	const kidnapped = to.getStatus("kidnapped")

	if (!kidnapped) {
		// Deal unstoppable attack to target
		rs.prototypes.unstoppableAttack.reason = "slit in the neck by an __Assassin__"

		// Non-astral, shift broadcast forward
		rs.prototypes.unstoppableAttack(actionable, game, params, false, 1)
	} else {
		game.addMessage(from, ":exclamation: You could not kill your target because they were abducted!")
	}

	// Destroy this instance
	return true
}

export = assassination
