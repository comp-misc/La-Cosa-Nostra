import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../../../roles/parts/targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "insure",
		description: "Produce an insurance quote for a player",
		emoji: ":ticket:",
	},
	actionVerb: "insure",
	actionId: "insurance_broker/insure",
	getActionOptions: (__, from, target) => ({
		name: "Insurance-Broker-insure",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.DEFAULT,
	}),
})
