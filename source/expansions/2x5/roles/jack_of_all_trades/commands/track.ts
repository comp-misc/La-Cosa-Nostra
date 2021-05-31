import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import Ability from "../Ability"
import createCommand from "./createCommand"

export default createCommand({
	commandName: "track",
	commandDescription: "Select a player to track",
	actionType: Ability.TRACK,
	actionVerb: "track",
	emoji: ":mag_right:",
	addAction: async (game, from, target) => {
		await game.addAction("jack_of_all_trades/track", ["cycle"], {
			name: "Jack-of-All-Trades-track",
			expiry: 1,
			from,
			to: target,
			priority: ActionPriorities.INVESTIGATE,
		})
	},
})
