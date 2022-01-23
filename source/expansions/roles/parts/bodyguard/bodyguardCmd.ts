import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "bodyguard",
		description: "Select a player to bodyguard",
		emoji: ":guard:",
	},
	actionVerb: "bodyguard",
	actionId: "bodyguard/guard",
	getActionOptions: (__, from, target) => ({
		name: "Bodyguard-guard",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.PROTECT,
	}),
})
