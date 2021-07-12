import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "monitor",
		description: "Watch a player to see if any actions are performed by or on them",
		emoji: ":mag_right:",
	},
	actionVerb: "monitor",
	actionId: "motion_detector/monitor",
	getActionOptions: (__, from, target) => ({
		name: "Motion-Detector-monitor",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	}),
})
