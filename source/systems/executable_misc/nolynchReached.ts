// Post when a lynch on someone is reached

import Game from "../game_templates/Game"
import texts from "./text/texts"

export = async (game: Game): Promise<void> => {
	const main_channel = game.getMainChannel()

	let message = texts.nolynch_reached

	message = message.replace(new RegExp("{;votes}", "g"), `${game.getNoLynchVotesRequired()}`)

	await main_channel.send(message)
}
