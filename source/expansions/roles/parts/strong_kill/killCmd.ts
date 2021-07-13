import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import { createBasicTargetableCommand } from "../targetableRolePart/command"

export default createBasicTargetableCommand({
	command: {
		name: "strongkill",
		description: "Selects a player to strong kill",
		emoji: ":dagger:",
		aliases: ["strong_kill", "strong-kill"],
	},
	actionVerb: "strong kill",
	actionId: "strong_kill/kill",
	getActionOptions: (__, from, target) => ({
		name: "Strong-Kill-kill",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.KILL,
	}),
})
