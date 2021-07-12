import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "jail",
		description: "Selects a player to jail",
		emoji: ":european_castle:",
	},
	actionVerb: "jail",
	actionId: "jailkeeper/jail",
	getActionOptions: (__, from, target) => ({
		name: "Jailkeeper-jail",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.ROLEBLOCK + 0.1,
	}),
})
