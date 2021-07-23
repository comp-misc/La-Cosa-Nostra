import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../../../roles/parts/targetableRolePart"

export default createBasicTargetableCommand({
	command: {
		name: "recruit",
		description: "Select a player to recruit",
		emoji: ":waxing_crescent_moon:",
	},
	actionVerb: "recruit",
	actionId: "recruiter/recruit",
	getActionOptions: (__, from, target) => ({
		name: "Recruiter-recruit",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.DEFAULT,
	}),
})
