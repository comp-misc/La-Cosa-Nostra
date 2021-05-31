import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import { createBasicConsecutiveRoleCommand } from "../../ConsecutiveTargetConfig"

export default createBasicConsecutiveRoleCommand({
	commandName: "protect",
	commandDescription: "Select a player to protect at night",
	actionVerb: "protect",
	previousTargetsKey: "protectTargets",
	emoji: ":shield:",
	addAction: async (game, from, target) => {
		await game.addAction("town_doctor/protect", ["cycle"], {
			name: "Doc-protect",
			expiry: 1,
			from,
			to: target,
			priority: ActionPriorities.PROTECT,
		})
	},
	deleteAction: (game, from) => {
		game.actions.delete((x) => x.from === from.identifier && x.identifier === "town_doctor/protect")
	},
})
