import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../../../roles/parts/targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "bribe",
		description: "Attempts to bribe a player",
		emoji: ":moneybag:",
	},
	actionVerb: "bribe",
	actionId: "lobbyist/bribe",
	getActionOptions: (__, from, target) => ({
		name: "Lobbyist-bribe",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.DEFAULT,
	}),
})
