import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "kill",
		description: "Selects a player to vigilante kill",
		emoji: ":dagger:",
	},
	actionVerb: "kill",
	actionId: "vigilante/kill",
	getActionOptions: (__, from, target) => ({
		name: "Vigilante-kill",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.KILL,
	}),
})
