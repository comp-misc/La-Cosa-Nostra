// Post when a lynch on someone is reached

import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"
import texts from "./text/texts"

export = async (game: Game, role: Player): Promise<void> => {
	const main_channel = game.getMainChannel()

	let message = texts.getting_lynched

	message = message.replace(new RegExp("{;player}", "g"), role.getDisplayName())
	message = message.replace(new RegExp("{;votes}", "g"), `${game.getVotesRequired() + role.getVoteOffset()}`)

	let nolynch_info = ""

	if (game.config["game"]["lynch"]["no-lynch-option"]) {
		nolynch_info = " if the no-lynch vote does not preside"
	}

	message = message.replace(new RegExp("{;extra_nolynch_info}", "g"), nolynch_info)

	await main_channel.send(message)
}
