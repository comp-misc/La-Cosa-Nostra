import { RoleActionable } from "../../../../../systems/actionables"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"
import investigationImmunity from "../../../rolesystem/knight_errant/investigationImmunity"

const investigate: RoleActionable = (actionable, game, params) => {
	game.execute("visit", {
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
	if (immunity >= 1 || investigationImmunity(target)) {
		game.addMessage(from, ":mag: You got the result of __False__.")
	} else if (
		["cop", "gunsmith", "jailkeeper", "serial_killer"].includes(target.role_identifier) ||
		target.getRoleOrThrow().alignment === "mafia"
	) {
		game.addMessage(from, ":mag: You got the result of __True__.")
	} else {
		game.addMessage(from, ":mag: You got the result of __False__.")
	}

	attributeDecrement(actionable, game, params)
}

investigate.TAGS = ["drivable", "roleblockable", "visit"]

export default investigate
