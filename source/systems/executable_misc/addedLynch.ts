import Game from "../game_templates/Game"
import Player from "../game_templates/Player"
import texts from "./text/texts"

const getVotesOnPlayer = (player: Player): string => {
	const votes = player.countVotes()

	if (votes == 1) {
		return "__1__ vote"
	} else {
		return "__" + votes + "__ votes"
	}
}

const hammerAlert = (game: Game, player: Player): string => {
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
		hammer_votes = (players_alive + 2) / 2
	}

	const votes = player.countVotes()

	if (hammer_votes - votes == 1) {
		return "\n\n:bell:  There is __1__ more vote required for an instant lynch!"
	}
	if (hammer_votes - votes == 2 && votes > 5) {
		return "\n\n:bell:  There are __2__ more votes required for an instant lynch!"
	}
	return ""
}

export = async (game: Game, voter: Player, voted: Player): Promise<void> => {
	let message = texts.lynching

	message = message.replace(new RegExp("{;voter}", "g"), voter.getDisplayName())
	message = message.replace(new RegExp("{;voted}", "g"), voted.getDisplayName())
	message = message.replace(new RegExp("{;votes}", "g"), getVotesOnPlayer(voted))
	message = message.replace(new RegExp("{;hammer_alert}", "g"), hammerAlert(game, voted))

	await game.getMainChannel().send(message)
}
