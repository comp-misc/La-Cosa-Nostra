import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "kill",
		description: "Selects a player to kill",
		emoji: ":dagger:",
	},
	actionVerb: "kill",
	actionId: "regular_kill/kill",
	getActionOptions: (__, from, target) => ({
		name: "Regular-Kill-kill",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.KILL,
	}),
})
