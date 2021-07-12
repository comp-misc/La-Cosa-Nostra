import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "roleblock",
		description: "Selects a player to roleblock",
		emoji: ":no_entry_sign:",
	},
	actionVerb: "roleblock",
	actionId: "roleblocker/roleblock",
	getActionOptions: (__, from, target) => ({
		name: "Roleblocker-roleblock",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.ROLEBLOCK,
	}),
})
