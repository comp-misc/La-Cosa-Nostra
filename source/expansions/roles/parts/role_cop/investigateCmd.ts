import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "investigate",
		description: "Investigate a player to discover their role name",
		emoji: ":mag_right:",
	},
	actionVerb: "investigate",
	actionId: "role_cop/investigate",
	getActionOptions: (__, from, target) => ({
		name: "RoleCop-investigate",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	}),
})
