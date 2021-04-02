import auxils from "../../systems/auxils"
import { SpecialVoteType } from "../../systems/game_templates/Game"
import { GameCommand } from "../CommandType"

const unvote: GameCommand = async (game, message, params) => {
	if (!game.isDay()) {
		await message.channel.send(":x:  There is no trial during the night!")
		return
	}

	const self = game.getPlayerById(message.author.id)

	if (!self) {
		await message.channel.send(":x:  You are not in the game!")
		return
	}

	if (!self.isAlive()) {
		await message.channel.send(":x:  You have died and cannot vote!")
		return
	}

	let special_vote_types = game.getPeriodLog().special_vote_types

	if (params.length < 1) {
		// Unvote everybody
		const voted = game.getVotesBy(self.identifier)
		for (const vote of voted) {
			await game.toggleVote(self, vote)
		}

		if (game.isVotingNoLynch(self.identifier)) {
			await game.toggleVote(self, "nl")
		}

		for (const voteType of special_vote_types) {
			if (voteType.voters.some((x) => x.identifier === self.identifier)) {
				if (voteType.identifier === "nl") {
					await game.toggleVote(self, voteType.identifier, true)
				} else {
					const who = game.getPlayerByIdentifier(voteType.identifier)
					if (who) {
						await game.toggleVote(self, who, true)
					} else {
						game.logger.logError(new Error(`No player found with identifier ${voteType.identifier}`))
					}
				}
			}
		}
		return
	}

	const target = params[0]

	const player = game.getPlayerMatch(target)

	// Check special votes
	special_vote_types = game.getPeriodLog().special_vote_types
	const max_score: { score: number; special_vote?: SpecialVoteType } = { score: 0 }
	for (let i = 0; i < special_vote_types.length; i++) {
		const value = auxils.hybridisedStringComparison(special_vote_types[i].name, target)

		if (value > max_score.score) {
			max_score.score = value
			max_score.special_vote = special_vote_types[i]
		}
	}

	if (player.score < 0.7 && max_score.score < 0.7) {
		await message.channel.send(":x:  I cannot find that player!")
		return null
	}

	if (player.score > max_score.score) {
		const thePlayer = player.player

		if (!thePlayer.isVotedAgainstBy(self.identifier)) {
			await message.channel.send(":x:  You are not currently voting on **" + thePlayer.getDisplayName() + "**!")
			return
		}

		await game.toggleVote(self, thePlayer)
	} else if (max_score.special_vote) {
		const special_vote = max_score.special_vote

		if (!special_vote.voters.some((x) => x.identifier === self.identifier)) {
			await message.channel.send(":x:  You are not currently voting on the **" + special_vote.name + "**!")
			return
		}
		if (special_vote.identifier === "nl") {
			await game.toggleVote(self, special_vote.identifier, true)
		} else {
			const who = game.getPlayerByIdentifier(special_vote.identifier)
			if (who) {
				await game.toggleVote(self, who, true)
			} else {
				game.logger.logError(new Error(`No player found with identifier ${special_vote.identifier}`))
			}
		}
	}
}

unvote.ALLOW_PREGAME = false
unvote.ALLOW_GAME = true
unvote.ALLOW_POSTGAME = false

export = unvote
