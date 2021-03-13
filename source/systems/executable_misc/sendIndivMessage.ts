import Game from "../game_templates/Game"

export = async (game: Game, identifier: string, message: string): Promise<void> => {
	const player = game.getPlayerByIdentifier(identifier)
	if (!player) {
		throw new Error(`No player found with id ${identifier}`)
	}
	await player.getPrivateChannel().send(message)
}
