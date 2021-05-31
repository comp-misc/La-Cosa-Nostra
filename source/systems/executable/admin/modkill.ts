import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"

export default async (game: Game, player: Player): Promise<void> => {
	// Effect is immediate
	await game
		.getMainChannel()
		.send(":exclamation: **" + player.getDisplayName() + "** has been removed from the game by a moderator.")
	await game.kill(player, "__modkilled__")
	await game.checkWin()
}
