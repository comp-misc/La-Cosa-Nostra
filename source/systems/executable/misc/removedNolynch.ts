import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"
import texts from "./text/texts"

export default async (game: Game, voter: Player): Promise<void> => {
	const message = texts.revert_nolynching.replace(new RegExp("{;voter}", "g"), voter.getDisplayName())

	await game.getMainChannel().send(message)
}
