import { RoleActionable } from "../../../systems/actionables"
import rs from "../../../rolesystem/rolesystem"

const poison_kill: RoleActionable = (actionable, game) => {
	// Deals an Unstoppable attack

	const poisoner = game.getPlayerByIdentifierOrThrow(actionable.from)
	const poisoned = game.getPlayerByIdentifierOrThrow(actionable.to)

	if (!poisoned.isAlive()) {
		return
	}

	rs.prototypes.unstoppableAttack.reason = "poisoned to death by an __Apothecarist__"

	const outcome = rs.prototypes.unstoppableAttack(actionable, game)

	if (!outcome) {
		game.addMessage(
			poisoner,
			":exclamation: Your poisoned target, **" + poisoned.getDisplayName() + "** could not be killed from the poison!"
		)
	}
}

export = poison_kill
