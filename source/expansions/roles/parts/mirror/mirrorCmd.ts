import { createBasicActionToggleCommand } from "../actionToggleRolePart/command"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"

export default createBasicActionToggleCommand({
	command: {
		name: "mirror",
		description: "Sets whether your mirror ability is enabled",
		emoji: ":mirror:",
	},
	actionId: "mirror/mirror",
	actionVerb: "mirror",
	getActionOptions: (game, from) => ({
		name: "Mirror",
		expiry: 1,
		from,
		to: from,
		priority: ActionPriorities.HIGH,
	}),
})
