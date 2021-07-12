import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "watch",
		description: "Watch a player to see what actions are performed on them",
		emoji: ":telescope:",
	},
	actionVerb: "watch",
	actionId: "voyeur/watch",
	getActionOptions: (__, from, target) => ({
		name: "Voyeur-watch",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	}),
})
