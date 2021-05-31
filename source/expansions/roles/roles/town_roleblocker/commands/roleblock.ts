import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import { createBasicConsecutiveRoleCommand } from "../../ConsecutiveTargetConfig"

export default createBasicConsecutiveRoleCommand({
	commandName: "roleblock",
	commandDescription: "Selects a player to roleblock",
	actionVerb: "roleblock",
	previousTargetsKey: "roleblockTargets",
	emoji: ":no_entry_sign:",
	addAction: async (game, from, target) => {
		await game.addAction("town_roleblocker/roleblock", ["cycle"], {
			name: "Town-Roleblocker-roleblock",
			expiry: 1,
			from,
			to: target,
			priority: ActionPriorities.ROLEBLOCK,
		})
	},
	deleteAction: (game, from) => {
		game.actions.delete((x) => x.from === from.identifier && x.identifier.startsWith("town_roleblocker/"))
	},
})
