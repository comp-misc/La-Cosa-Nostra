import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "watch",
		description: "Watch a player to see which players visited them",
		emoji: ":telescope:",
	},
	actionVerb: "watch",
	actionId: "watcher/watch",
	getActionOptions: (__, from, target) => ({
		name: "Watcher-watch",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	}),
})
