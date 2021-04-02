import auxils from "../../systems/auxils"
import { SpecialVoteType } from "../../systems/game_templates/Game"
import { GameCommand } from "../CommandType"

const vote: GameCommand = async (game, message, params) => {
	const config = game.config

	if (!game.isDay()) {
		await message.channel.send(":x: There is no trial during the night!")
		return
	}

	if (params.length < 1) {
		await message.channel.send(
			":x: Wrong syntax! Use `" + config["command-prefix"] + "vote <alphabet/name>` instead!"
		)
		return
	}

	const self = game.getPlayerById(message.author.id)

	if (!self) {
		await message.channel.send(":x: You are not in the game!")
		return
	}

	if (!self.isAlive()) {
		await message.channel.send(":x: You have died and cannot vote!")
		return
	}

	const target = params[0]

	const player = game.getPlayerMatch(target)

	// Check special votes
	const special_vote_types = game.getPeriodLog().special_vote_types
	const max_score: { score: number; special_vote?: SpecialVoteType } = { score: 0 }
	for (let i = 0; i < special_vote_types.length; i++) {
		const value = auxils.hybridisedStringComparison(special_vote_types[i].name, target)

		if (value > max_score.score) {
			max_score.score = value
			max_score.special_vote = special_vote_types[i]
		}
	}

	if (player.score < 0.7 && max_score.score < 0.7) {
		// Disallow
		await message.channel.send(":x: I cannot find that player!")
		return
	}

	let result: boolean | null
	if (player.score > max_score.score) {
		const thePlayer = player.player

		if (!thePlayer.isAlive()) {
			await message.channel.send(":x: That player is dead!")
			return
		}

		if (thePlayer.isVotedAgainstBy(self.identifier)) {
			await message.channel.send(":x: You are already voting on **" + thePlayer.getDisplayName() + "**!")
			return
		}

		result = await game.toggleVote(self, thePlayer)
	} else {
		const special_vote = max_score.special_vote as SpecialVoteType

		if (special_vote.voters.some((x) => x.identifier === self.identifier)) {
			await message.channel.send(":x: You are already voting on the **" + special_vote.name + "**!")
			return
		}
		if (special_vote.identifier === "nl") {
			result = await game.toggleVote(self, special_vote.identifier, true)
		} else {
			const voter = game.getPlayerByIdentifier(special_vote.identifier)
			if (voter) {
				result = await game.toggleVote(self, voter, true)
			} else {
				game.logger.logError(new Error(`No player found with identifier ${special_vote.identifier}`))
				result = false
			}
		}
	}

	if (result !== false) {
		if (!result) {
			await message.channel.send(":x: You cannot vote on that option right now.")
		}
		return
	}
	// reverts the vote and passes the vote onto the other player
	const voted = game.getVotesBy(self.identifier)
	voted.forEach((voter) => game.toggleVote(self, voter))

	if (game.isVotingNoLynch(self.identifier)) {
		await game.toggleVote(self, "nl")
	}

	for (let i = 0; i < special_vote_types.length; i++) {
		if (special_vote_types[i].voters.some((x) => x.identifier === self.identifier)) {
			const identifier = special_vote_types[i].identifier
			if (identifier === "nl") {
				await game.toggleVote(self, identifier, true)
			} else {
				const voter = game.getPlayerByIdentifier(identifier)
				if (voter) {
					await game.toggleVote(self, voter, true)
				} else {
					game.logger.logError(new Error(`No player found with identifier ${identifier}`))
				}
			}
		}
	}

	await game.toggleVote(self, player.player)
}

vote.ALLOW_PREGAME = false
vote.ALLOW_GAME = true
vote.ALLOW_POSTGAME = false

export = vote
