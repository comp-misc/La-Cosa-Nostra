import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import { createBasicConsecutiveRoleCommand } from "../../ConsecutiveTargetConfig"

export default createBasicConsecutiveRoleCommand({
	commandName: "roleblock",
	commandDescription: "Selects a player to roleblock",
	actionVerb: "roleblock",
	previousTargetsKey: "roleblockTargets",
	emoji: ":no_entry_sign:",
	addAction: async (game, from, target) => {
		await game.addAction("mafia_roleblocker/roleblock", ["cycle"], {
			name: "Mafia-Roleblocker-roleblock",
			expiry: 1,
			from,
			to: target,
			priority: ActionPriorities.ROLEBLOCK,
		})
		await game
			.getChannel("mafia")
			.send(
				`:no_entry_sign: **${from.getDisplayName()}** is roleblocking **${target.getDisplayName()}** tonight.`
			)
	},
	onNoAction: async (game, from) => {
		await game
			.getChannel("mafia")
			.send(`:no_entry_sign: **${from.getDisplayName()}** is not roleblocking anyone tonight.`)
	},
	deleteAction: (game, from) => {
		game.actions.delete((x) => x.from === from.identifier && x.identifier.startsWith("mafia_roleblocker/"))
	},
})
