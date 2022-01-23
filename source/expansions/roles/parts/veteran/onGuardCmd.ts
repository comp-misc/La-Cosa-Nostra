import { createBasicActionToggleCommand } from "../actionToggleRolePart/command"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"

export default createBasicActionToggleCommand({
	command: {
		name: "on-guard",
		description: "Changes whether you are on guard. Kills anyone who visits you when on",
		emoji: ":guard:",
	},
	actionVerb: "guard",
	actionId: "veteran/on-guard",
	getActionOptions: (game, from) => ({
		name: "Veteran/OnGuard",
		expiry: 1,
		from,
		to: from,
		priority: ActionPriorities.LOWEST,
	}),
})
