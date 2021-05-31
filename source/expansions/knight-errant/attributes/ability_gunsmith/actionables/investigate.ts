import { RoleActionable } from "../../../../../systems/actionables"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"

const investigate: RoleActionable = async (actionable, game, params) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Gunsmith-investigation",
	})

	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	// Check roles
	const immunity = target.getStat("detection-immunity", Math.max)

	// Not immune
	if (immunity < 1) {
		game.addMessage(from, ":mag: You got the result of __False__.")
	} else if (
		["town_alignment_cop", "town_gunsmith", "town_jailkeeper", "serial_killer"].includes(target.role.identifier) ||
		target.role.properties.alignment === "mafia"
	) {
		game.addMessage(from, ":mag: You got the result of __True__.")
	} else {
		game.addMessage(from, ":mag: You got the result of __False__.")
	}

	await attributeDecrement(actionable, game, params)
}

investigate.TAGS = ["drivable", "roleblockable", "visit"]

export default investigate
