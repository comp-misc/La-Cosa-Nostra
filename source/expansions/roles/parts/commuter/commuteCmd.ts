import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicActionToggleCommand } from "../actionToggleRolePart/command"

export default createBasicActionToggleCommand({
	command: {
		name: "commute",
		description: "Allows you to commute the night",
		emoji: ":camping:",
	},
	actionId: "commuter/commute",
	actionVerb: "commute",
	getActionOptions: (game, from) => ({
		name: "Commuter-commute",
		expiry: 1,
		from,
		to: from,
		priority: ActionPriorities.HIGHEST,
	}),
})
