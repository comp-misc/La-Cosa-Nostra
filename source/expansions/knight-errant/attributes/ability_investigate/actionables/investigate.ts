import { Alignment } from "../../../../../systems/Role"
import { RoleActionable } from "../../../../../systems/actionables"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"

const responses: Record<Alignment, string> = {
	neutral: ":mag_right: Your target is __Anti-town__.",
	cult: ":mag_right: Your target is __Anti-town__.",
	mafia: ":mag_right: Your target is __Anti-town__.",
	town: ":mag_right: Your target is __Town__.",

	role: ":mag_right: Your target's role is **{;role}**.",
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
	const targetRole = target.getRoleOrThrow()

	// Not immune
	if (immunity < 1) {
		if (targetRole["reveal-role-on-interrogation"]) {
			const response = responses["role"].replace(new RegExp("{;role}", "g"), targetRole["role-name"])
			game.addMessage(from, response)
		} else {
			const response = responses[targetRole.alignment]
			game.addMessage(from, response ? response : responses["town"])
		}
	} else {
		// Show Town
		game.addMessage(from, responses["town"])
	}

	await attributeDecrement(actionable, game, params)
}

investigate.TAGS = ["drivable", "roleblockable", "visit"]

export default investigate
