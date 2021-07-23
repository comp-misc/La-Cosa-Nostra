import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../../../roles/parts/targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "cure",
		description: "Selects a player to cure of the infection",
		emoji: ":test_tube:",
	},
	actionVerb: "cure",
	actionId: "virologist/cure",
	getActionOptions: (__, from, target) => ({
		name: "Virologist-cure",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.LOWEST - 0.1,
	}),
})
