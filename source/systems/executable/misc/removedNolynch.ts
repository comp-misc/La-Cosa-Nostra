import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"
import texts from "./text/texts"

export = async (game: Game, voter: Player): Promise<void> => {
	let message = texts.revert_nolynching

	message = message.replace(new RegExp("{;voter}", "g"), voter.getDisplayName())

	await game.getMainChannel().send(message)
}
