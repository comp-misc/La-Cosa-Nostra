// Remove a player emote
// used when the player is killed

import alphabets from "../../alpha_table"
import Game from "../../game_templates/Game"

export = async (game: Game, identifier: string): Promise<void> => {
	const role = game.getPlayerByIdentifier(identifier)
	if (!role) {
		throw new Error(`No player found with identifier ${identifier}`)
	}

	const alphabet = role.alphabet
	const target_emote = alphabets[alphabet]

	role.clearVotes()

	const period_log = game.getPeriodLog()
	if (!period_log || !period_log.trial_vote) {
		return
	}

	const trial = game.findTextChannel(period_log.trial_vote.channel)

	const messages = period_log.trial_vote.messages

	for (let i = 0; i < messages.length; i++) {
		const message = await trial.messages.fetch(messages[i])

		const emote = message.reactions.resolve(target_emote)

		if (emote) {
			await emote.remove()
		}
	}
}
