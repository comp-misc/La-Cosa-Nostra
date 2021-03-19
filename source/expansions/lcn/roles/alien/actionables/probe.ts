import rs from "../../../../../rolesystem/rolesystem"
import { RoleActionable } from "../../../../../systems/actionables"

const probe: RoleActionable<unknown> = (actionable, game, params) => {
	const target = game.getPlayerByIdentifierOrThrow(actionable.to)
	const alien = game.getPlayerByIdentifierOrThrow(actionable.from)

	rs.prototypes.unstoppableKidnap.reason = "abducted"
	const outcome = rs.prototypes.unstoppableKidnap(actionable, game, params)

	if (outcome) {
		game.addMessage(target, ":exclamation: You were abducted last night!")

		if (!alien.misc.alien_kidnappings.includes(actionable.to)) {
			alien.misc.alien_kidnappings.push(actionable.to)
		}
	} else {
		game.addMessage(target, ":exclamation: Someone tried to abduct you last night but you could not be abducted!")
	}
}
probe.TAGS = ["drivable", "roleblockable", "visit"]

export = probe
