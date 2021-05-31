import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"
import texts from "./text/texts"

const getNolynchVotes = (game: Game): string => {
	const votes = game.getNoLynchVoteCount()

	if (votes == 1) {
		return "__1__ vote"
	} else {
		return `__${votes}__ votes`
	}
}

const hammerAlert = (game: Game): string => {
	let players_alive = 0

	for (let i = 0; i < game.players.length; i++) {
		if (game.players[i].status.alive) {
			players_alive++
		}
	}

	let hammer_votes: number
	if (players_alive % 2 == 1) {
		hammer_votes = (players_alive + 1) / 2
	} else {
		hammer_votes = players_alive / 2
	}

	const votes = game.getNoLynchVoteCount()

	if (hammer_votes - votes == 1) {
		return "\n\n:bell:  There is __1__ more vote required for an instant no-lynch!"
	}
	if (hammer_votes - votes == 2 && votes > 5) {
		return "\n\n:bell:  There are __2__ more votes required for an instant no-lynch!"
	}
	return ""
}

export default async (game: Game, voter: Player): Promise<void> => {
	let message = texts.nolynching

	message = message.replace(new RegExp("{;voter}", "g"), voter.getDisplayName())
	message = message.replace(new RegExp("{;votes}", "g"), getNolynchVotes(game))
	message = message.replace(new RegExp("{;hammer_alert}", "g"), hammerAlert(game))

	await game.getMainChannel().send(message)
}
