import texts from "./text/texts"
import format from "./__formatter"
import auxils from "../../auxils"
import Player from "../../game_templates/Player"
import Game from "../../game_templates/Game"

const getVoteList = (game: Game, roles: Player[]): string => {
	const no_lynch_option = game.config.game.lynch["no-lynch-option"]
	const players_alive = roles.filter((player) => player.status.alive).length
	const players_voting: string[] = []

	let lynch_votes: number
	let nolynch_votes: number
	if (players_alive % 2 == 1) {
		lynch_votes = (players_alive + 1) / 2
		nolynch_votes = (players_alive + 1) / 2
	} else {
		lynch_votes = (players_alive + 2) / 2
		nolynch_votes = players_alive / 2
	}

	const displays = []
	let names = ""
	roles.forEach((role) => {
		if (role.status.alive) {
			// Get display role
			// Get display role
			if (role.getStatus("lynchProof")) {
				displays.push("<@" + role.id + "> (\\✖)")
				return
			}

			// Get people voting against
			const voting_against = role.votes
			const concat = []

			// Get their display names
			for (let j = 0; j < voting_against.length; j++) {
				// Mapped by IDs
				const player = game.getPlayerByIdentifier(voting_against[j].identifier)
				if (player) {
					players_voting.push(player.identifier)
					concat.push(player.getDisplayName())
				} else {
					game.logger.logError(new Error(`No player found with id ${voting_against[j].identifier}`))
					concat.push("???")
				}
			}

			names = auxils.pettyFormat(concat)
			names = voting_against.length > 0 ? ": " + names : ""

			displays.push(`<@${role.id}> (${role.countVotes()}/${lynch_votes})${names}`)
		} else if (role.time_of_death == undefined && game.getPeriod() % 2 == 0) {
			if (role.getStatus("lynchProof")) {
				displays.push("<@" + role.id + "> (\\✖)")
				return
			}

			// Get people voting against
			const voting_against = role.votes
			const concat: string[] = []

			// Get their display names
			voting_against.forEach((voter) => {
				// Mapped by IDs
				const player = game.getPlayerByIdentifier(voter.identifier)

				players_voting.push(voter.identifier)
				if (player) {
					players_voting.push(player.identifier)
					concat.push(player.getDisplayName())
				} else {
					game.logger.logError(new Error(`No player found with id ${voter.identifier}`))
					concat.push("???")
				}
			})

			names = auxils.pettyFormat(concat)
			names = voting_against.length > 0 ? ": " + names : ""

			displays.push("<@" + role.id + "> (:x:)" + names)
		}
	})

	if (no_lynch_option) {
		const voters = game.getNoLynchVoters()
		const vote_count = game.getNoLynchVoteCount()

		players_voting.push(
			...(voters.map((x) => game.getPlayerByIdentifier(x)?.identifier).filter((id) => !!id) as string[])
		)

		const concat = voters.map((x) => game.getPlayerByIdentifier(x)?.getDisplayName() || "???")

		names = auxils.pettyFormat(concat)
		names = voters.length > 0 ? ": " + names : ""

		displays.push(`No-lynch (${vote_count}/${nolynch_votes})${names}`)
	}

	const special_vote_types = game.getPeriodLog().special_vote_types

	for (let i = 0; i < special_vote_types.length; i++) {
		const voters = special_vote_types[i].voters
		const vote_count = game.getSpecialVoteCount(special_vote_types[i].identifier)

		const player = game.getPlayerByIdentifier(special_vote_types[i].identifier)
		if (player) {
			players_voting.push(player.identifier)
		}

		names = auxils.pettyFormat(
			voters.map((x) => game.getPlayerByIdentifier(x.identifier)?.getDisplayName() || "???")
		)
		names = voters.length > 0 ? ": " + names : ""

		displays.push(`**${special_vote_types[i].name}** (${vote_count})${names}`)
	}

	const voters = roles
		.filter((role) => role.status.alive && !players_voting.includes(role.identifier))
		.map((role) => role.identifier)

	displays.push("\n" + `Not voting (${voters.length}/${players_alive})`)

	return displays.join("\n")
}

const getVoteInfo = (roles: Player[]): string => {
	let players_alive = 0

	for (let i = 0; i < roles.length; i++) {
		if (roles[i].status.alive) {
			players_alive++
		}
	}

	let lynch_votes: number
	let nolynch_votes: number
	if (players_alive % 2 == 1) {
		lynch_votes = (players_alive + 1) / 2
		nolynch_votes = (players_alive + 1) / 2
	} else {
		lynch_votes = (players_alive + 2) / 2
		nolynch_votes = players_alive / 2
	}
	return `There are required **${lynch_votes}** votes to lynch, and **${nolynch_votes}** votes to no-lynch.`
}

export default async (game: Game, ended = false): Promise<void> => {
	const roles = game.players
	const log = game.getPeriodLog()
	if (!log || !log.trial_vote) {
		return
	}

	const channel = game.findTextChannel(log.trial_vote.channel)

	const display_message = await channel.messages.fetch(log.trial_vote.messages[0])

	let message: string
	if (ended) {
		message = texts.public_vote_ended
	} else {
		message = texts.public_vote
	}

	message = message.replace("{;day}", `${game.getPeriod() / 2}`)
	message = message.replace("{;vote_info}", `${getVoteInfo(roles)}`)
	message = message.replace("{;public_votes}", `${getVoteList(game, roles)}`)

	await display_message.edit(format(game, message))
}
