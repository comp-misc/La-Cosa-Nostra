import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "interrogate",
		description: "Selects a player to interrogate",
		emoji: ":chair:",
	},
	actionVerb: "interrogate",
	actionId: "interrogator/interrogate",
	getActionOptions: (__, from, target) => ({
		name: "Interrogator-interrogate",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.DEFAULT,
	}),
})
