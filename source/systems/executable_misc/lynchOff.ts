// Post when a lynch on someone is reached

import Game from "../game_templates/Game"
import Player from "../game_templates/Player"

const texts = require("./text/texts")

export = async (game: Game, role: Player): Promise<void> => {
	const main_channel = game.getMainChannel()

	let message = texts.lynch_off

	message = message.replace(new RegExp("{;player}", "g"), role.getDisplayName())
	message = message.replace(new RegExp("{;votes}", "g"), game.getVotesRequired() + role.getVoteOffset())

	await main_channel.send(message)
}
