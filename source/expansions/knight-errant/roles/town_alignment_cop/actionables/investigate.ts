import { Alignment } from "../../../../../systems/Role"
import { RoleActionable } from "../../../../../systems/actionables"

const responses: Record<Alignment, string> = {
	"3p": "mag_right: Your target is __Anti-Town__.",
	cult: ":mag_right: Your target is __Anti-Town__.",
	mafia: ":mag_right: Your target is __Anti-Town__.",
	town: ":mag_right: Your target is __Town__.",
	role: ":mag_right: Your target's role is **{;role}**.",
}

const investigate: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Cop-investigation",
	})

	const from = game.getPlayerByIdentifierOrThrow(actionable.from)
	const target = game.getPlayerByIdentifierOrThrow(actionable.to)

	// Check roles
	const immunity = target.getStat("detection-immunity", Math.max)
	const targetRole = target.role

	// Not immune
	if (immunity < 1) {
		if (targetRole.properties["reveal-role-on-interrogation"]) {
			const response = responses.role.replace(new RegExp("{;role}", "g"), targetRole.properties["role-name"])
			game.addMessage(from, response)
		} else if (targetRole.identifier === "town_miller") {
			game.addMessage(from, responses.mafia)
		} else {
			const response = responses[targetRole.properties.alignment]
			game.addMessage(from, response ? response : responses.town)
		}
	} else {
		// Show Town
		game.addMessage(from, responses.town)
	}
}
investigate.TAGS = ["drivable", "roleblockable", "visit"]

export default investigate
