import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand, TargetableRoleCommand } from "../targetableRolePart/command"

export default (showVanillaAs: string): TargetableRoleCommand =>
	createBasicTargetableCommand({
		command: {
			name: "investigate",
			description: "Investigate a player to determine if they are " + showVanillaAs,
			emoji: ":mag_right:",
		},
		actionVerb: "investigate",
		actionId: "vanilla_cop/investigate",
		getActionOptions: (__, from, target) => ({
			name: "VanillaCop-investigate",
			expiry: 1,
			from,
			to: target,
			priority: ActionPriorities.INVESTIGATE,
		}),
	})
