import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import Ability from "../Ability"
import createCommand from "./createCommand"

export default createCommand({
	commandName: "kill",
	commandDescription: "Select a player to kill",
	actionType: Ability.KILL,
	actionVerb: "kill",
	emoji: ":dagger:",
	addAction: async (game, from, target) => {
		await game.addAction("jack_of_all_trades/kill", ["cycle"], {
			name: "Jack-of-All-Trades-kill",
			expiry: 1,
			from,
			to: target,
			priority: ActionPriorities.KILL,
		})
	},
})
