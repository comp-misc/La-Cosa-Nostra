import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "track",
		description: "Track a player to determine if they are visiting anyone",
		emoji: ":mag_right:",
	},
	actionVerb: "track",
	actionId: "lazy_tracker/track",
	getActionOptions: (__, from, target) => ({
		name: "Lazy-Tracker-track",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	}),
})
