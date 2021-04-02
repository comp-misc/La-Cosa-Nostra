import investigationImmunity from "../../../rolesystem/knight_errant/investigationImmunity"
import { Alignment } from "../../../../../systems/Role"
import { RoleActionable } from "../../../../../systems/actionables"

const responses: Record<Alignment, string> = {
	neutral: ":mag: Your target is __Anti-town__.",
	cult: ":mag: Your target is __Anti-town__.",
	mafia: ":mag: Your target is __Anti-town__.",
	town: ":mag: Your target is __Town__.",
	role: ":mag: Your target's role is **{;role}**.",
}

const investigate: RoleActionable = (actionable, game) => {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Cop-investigation",
	})

	const from = game.getPlayerByIdentifierOrThrow(actionable.from)
	const target = game.getPlayerByIdentifierOrThrow(actionable.to)

	// Check roles
	const immunity = target.getStat("detection-immunity", Math.max)
	const targetRole = target.getRoleOrThrow()

	// Not immune
	if (immunity < 1 && !investigationImmunity(target)) {
		if (targetRole["reveal-role-on-interrogation"] === true) {
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
}
investigate.TAGS = ["drivable", "roleblockable", "visit"]

export default investigate
