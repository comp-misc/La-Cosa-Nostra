import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "protect",
		description: "Select a player to protect at night",
		emoji: ":shield:",
		aliases: ["heal"],
	},
	actionVerb: "protect",
	actionId: "doctor/protect",
	getActionOptions: (__, from, target) => ({
		name: "Doctor-protect",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.PROTECT,
	}),
})
