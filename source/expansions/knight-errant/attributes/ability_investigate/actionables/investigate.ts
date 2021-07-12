import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"
import { RoleActionable } from "../../../../../systems/actionables"

const responses: Record<string, string> = {
	"3p": ":mag_right: Your target is __Anti-town__.",
	mafia: ":mag_right: Your target is __Anti-town__.",
	town: ":mag_right: Your target is __Town__.",
}

const investigate: RoleActionable = async (actionable, game, params) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Modular-investigation",
	})

	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	// Check roles
	const immunity = target.getStat("detection-immunity", Math.max)
	const targetRole = target.role

	// Not immune
	if (immunity < 1) {
		const response = responses[targetRole.properties.alignment.id]
		game.addMessage(from, response ? response : responses.town)
	} else {
		// Show Town
		game.addMessage(from, responses.town)
	}

	await attributeDecrement(actionable, game, params)
}

investigate.TAGS = ["drivable", "roleblockable", "visit"]

export default investigate
