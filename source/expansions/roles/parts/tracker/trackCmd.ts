import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "track",
		description: "Track a player to see which players they visited, if any",
		emoji: ":mag_right:",
	},
	actionVerb: "track",
	actionId: "tracker/track",
	getActionOptions: (__, from, target) => ({
		name: "Tracker-track",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	}),
})
