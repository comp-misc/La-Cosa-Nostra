import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import { createBasicConsecutiveRoleCommand } from "../../ConsecutiveTargetConfig"

export default createBasicConsecutiveRoleCommand({
	commandName: "jail",
	commandDescription: "Selects a player to jail",
	actionVerb: "jail",
	previousTargetsKey: "jailTargets",
	emoji: ":european_castle:",
	addAction: async (game, from, target) => {
		await game.addAction("town_jailkeeper/jail", ["cycle"], {
			name: "Jailkeeper-jail",
			expiry: 1,
			from,
			to: target,
			priority: ActionPriorities.HIGHEST,
		})
	},
	deleteAction: (game, from) => {
		game.actions.delete((x) => x.from === from.identifier && x.identifier.startsWith("town_roleblocker/"))
	},
})
