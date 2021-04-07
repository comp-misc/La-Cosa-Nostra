import { GameCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const getNumberEmoji = (count: number): string => {
	switch (count) {
		case 0:
			return ":two:"
		case 1:
			return ":three:"
		case 2:
			return ":four:"
		case 3:
			return ":five:"
		case 4:
			return ":six:"
		case 5:
			return ":seven:"
		case 6:
			return ":eight:"
		case 7:
			return ":nine:"
	}
	return ":information_source:"
}

const outcome: GameCommand = async (game, message) => {
	if (!game.isDay()) {
		await message.channel.send(":x:  There is no trial during the night!")
		return
	}

	const config = game.config
	const roles = game.players

	const lynch_config = config["game"]["lynch"]

	const no_lynch_votes = game.getNoLynchVoteCount()

	let most_votes_on_player = 0
	const players_alive = roles.filter((role) => role.status.alive).length
	let players: string[] = []

	const alivePlayers = roles.filter((role) => role.status.alive)

	for (const role of alivePlayers) {
		if (most_votes_on_player == role.countVotes()) {
			players.push(role.getDisplayName())
		}
		if (most_votes_on_player < role.countVotes() && !(2 * most_votes_on_player > players_alive)) {
			players = []
			players.push(role.getDisplayName())

			most_votes_on_player = role.countVotes()
		}
	}

	if (lynch_config["top-voted-lynch"]) {
		if (lynch_config["top-voted-lynch-minimum-votes"] > most_votes_on_player) {
			await message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
		} else {
			if (no_lynch_votes > most_votes_on_player) {
				await message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
			} else if (no_lynch_votes < most_votes_on_player) {
				if (players.length == 1) {
					await message.channel.send(
						":thought_balloon:  With the current votes **" + players[0] + "** will be __lynched__."
					)
				} else {
					if (lynch_config["tied-random"]) {
						let display = ":one:  **" + players[0] + "** __lynced__!,   "
						for (let i = 0; i < players.length - 1; i++) {
							display = display + getNumberEmoji(i) + "  **" + players[i + 1] + "** __lynced__!,   "
						}

						await message.channel.send(
							":thought_balloon:  With the current votes one of the two following options will occur:\n" +
								display
						)
					} else {
						await message.channel.send(
							":thought_balloon:  With the current votes a **no-lynch** will occur."
						)
					}
				}
			} else {
				if (lynch_config["tied-random"]) {
					players.push("No-lynch")

					let display = ":one:  **" + players[-1] + ",   "
					for (let i = 0; i < players.length - 1; i++) {
						display = display + getNumberEmoji(i) + "  **" + players[i] + "** __lynched__!,   "
					}

					await message.channel.send(
						":thought_balloon:  With the current votes one of the two following options will occur:\n" +
							display
					)
				} else {
					await message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
				}
			}
		}
	} else {
		if (lynch_config["allow-hammer"]) {
			await message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
		} else {
			let display = "**" + players[0] + "**"
			if (players.length > 1) {
				for (let i = 0; i < players.length - 2; i++) {
					display = display + ", " + players[i + 1]
				}
				display = display + "**" + players[players.length - 1] + "**"
				await message.channel.send(
					":thought_balloon:  With the current votes " + display + " will be __lynched__."
				)
			} else {
				await message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
			}
		}
	}
}

outcome.ALLOW_PREGAME = false
outcome.ALLOW_GAME = true
outcome.ALLOW_POSTGAME = false

export default makeCommand(outcome, {
	name: "outcome",
	description: "Shows the current vote outcome if the day ended now",
})
