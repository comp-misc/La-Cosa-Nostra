import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import Ability from "../Ability"
import createCommand from "./createCommand"

export default createCommand({
	commandName: "roleblock",
	commandDescription: "Select a player to roleblock",
	actionType: Ability.ROLEBLOCK,
	actionVerb: "roleblock",
	emoji: ":no_entry_sign:",
	addAction: async (game, from, target) => {
		await game.addAction("jack_of_all_trades/roleblock", ["cycle"], {
			name: "Jack-of-All-Trades-roleblock",
			expiry: 1,
			from,
			to: target,
			priority: ActionPriorities.ROLEBLOCK,
		})
	},
})
