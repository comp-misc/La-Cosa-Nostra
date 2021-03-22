import auxils from "../../systems/auxils"
import texts from "../../systems/executable/misc/text/texts"
import format from "../../systems/executable/misc/__formatter"
import { GameCommand } from "../CommandType"

const votecount: GameCommand = async (game, message) => {
	const roles = game.players
	const period = game.getPeriod()

	if (!game.isDay()) {
		await message.channel.send(":x:  There is no trial during the night!")
		return null
	}

	const no_lynch_option = game.config["game"]["lynch"]["no-lynch-option"]

	let sendable = texts.public_votecount

	sendable = sendable.replace("{;day}", `${period / 2}`)
	sendable = sendable.replace("{;public_votes}", getVoteList())

	await message.channel.send(format(game, sendable))

	function getVoteList() {
		const displays = []
		const players_voting = []
		const players_alive = roles.filter((role) => role.status.alive).length

		let lynch_votes: number
		if (players_alive % 2 == 1) {
			lynch_votes = (players_alive + 1) / 2
		} else {
			lynch_votes = (players_alive + 2) / 2
		}

		for (let i = 0; i < roles.length; i++) {
			if (roles[i].status.alive) {
				// Get display role

				// Get people voting against
				const voting_against = roles[i].votes
				const concat: string[] = []

				if (voting_against.length < 1) {
					continue
				}

				// Get their display names
				for (let j = 0; j < voting_against.length; j++) {
					// Mapped by IDs
					const player = game.getPlayerByIdentifier(voting_against[j].identifier)

					players_voting.push(voting_against[j].identifier)

					concat.push(player?.getDisplayName() || "???")
				}

				let names = auxils.pettyFormat(concat)
				names = voting_against.length > 0 ? ": " + names : ""

				displays.push(
					"**" + roles[i].getDisplayName() + "** (" + roles[i].countVotes() + "/" + lynch_votes + ")" + names
				)
			}
		}

		if (no_lynch_option) {
			let nolynch_votes: number
			if (players_alive % 2 == 1) {
				nolynch_votes = (players_alive + 1) / 2
			} else {
				nolynch_votes = players_alive / 2
			}

			const voters = game.getNoLynchVoters()
			const vote_count = game.getNoLynchVoteCount()

			players_voting.push(...voters)
			const concat = voters.map((x) => game.getPlayerByIdentifier(x)?.getDisplayName() || "???")

			let names = auxils.pettyFormat(concat)
			names = voters.length > 0 ? ": " + names : ""

			displays.push("**No-lynch** (" + vote_count + "/" + nolynch_votes + ")" + names)
		}

		const special_vote_types = game.getPeriodLog().special_vote_types

		for (let i = 0; i < special_vote_types.length; i++) {
			const voters = special_vote_types[i].voters
			const vote_count = game.getSpecialVoteCount(special_vote_types[i].identifier)

			players_voting.push(...voters)

			let names = auxils.pettyFormat(
				voters.map((x) => game.getPlayerByIdentifier(x.identifier)?.getDisplayName() || "???")
			)

			names = voters.length > 0 ? ": " + names : ""

			displays.push("**" + special_vote_types[i].name + "** (" + vote_count + ")" + names)
		}

		const voters = []

		for (let i = 0; i < roles.length; i++) {
			if (roles[i].status.alive) {
				if (!players_voting.includes(roles[i].identifier)) {
					voters.push(roles[i].identifier)
				}
			}
		}

		displays.push("\nNot voting (" + voters.length + "/" + players_alive + ")")

		return displays.join("\n")
	}
}

votecount.ALLOW_PREGAME = false
votecount.ALLOW_GAME = true
votecount.ALLOW_POSTGAME = false

export = votecount
