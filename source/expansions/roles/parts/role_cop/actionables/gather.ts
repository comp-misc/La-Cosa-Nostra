import { RoleActionable } from "../../../../../systems/actionables"
import Player from "../../../../../systems/game_templates/Player"

const gather: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "RoleCop-investigation",
		type: "investigate",
	})

	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)
	const role = getRole(target)

	game.addMessage(from, `:mag_right: Your target has been identified as the following role: **${role}**`)
}

const getRole = (player: Player): string => {
	const investigateRole = player.role.properties.investigation
	if (investigateRole && investigateRole.length > 0) {
		return investigateRole[0]
	}
	return player.role.getDisplayName()
}

gather.TAGS = ["drivable", "roleblockable", "visit"]

export default gather
