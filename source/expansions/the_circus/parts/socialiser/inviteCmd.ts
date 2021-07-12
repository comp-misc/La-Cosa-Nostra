import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../../../roles/parts/targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "invite",
		description: "Selects a player to invite to the party",
		emoji: ":tada:",
	},
	actionVerb: "invite",
	actionId: "socialiser/invite",
	getActionOptions: (__, from, target) => ({
		name: "Socialiser-invite",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.DEFAULT,
	}),
})
