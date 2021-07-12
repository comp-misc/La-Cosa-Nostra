import { RoleActionable } from "../../../../../systems/actionables"
import attributeDecrement from "../../../../../rolesystem/modular/attributeDecrement"
import JailKeeper from "../../../../roles/parts/jailkeeper"
import AlignmentCop from "../../../../roles/parts/alignment_cop"

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
	}
	const roleIds = target.role.allPartsMetadata.map((p) => p.identifier)
	if (
		target.role.hasPart(JailKeeper) ||
		target.role.hasPart(AlignmentCop) ||
		["town_gunsmith", "serial_killer"].some((id) => roleIds.includes(id)) ||
		target.role.properties.alignment.id === "mafia"
	) {
		game.addMessage(from, ":mag: You got the result of __True__.")
	} else {
		game.addMessage(from, ":mag: You got the result of __False__.")
	}

	await attributeDecrement(actionable, game, params)
}

investigate.TAGS = ["drivable", "roleblockable", "visit"]

export default investigate
