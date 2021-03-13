import Game from "../game_templates/Game"
import Player from "../game_templates/Player"
import texts from "./text/texts"

export = async (game: Game, voter: Player, voted: Player): Promise<void> => {
	let message = texts.unlynching

	message = message.replace(new RegExp("{;voter}", "g"), voter.getDisplayName())
	message = message.replace(new RegExp("{;voted}", "g"), voted.getDisplayName())

	await game.getMainChannel().send(message)
}
