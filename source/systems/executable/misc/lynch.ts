import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"

export = async (game: Game, role: Player): Promise<boolean> => {
	const lynchable = role.lynchable()

	if (!lynchable) {
		return false
	}

	const lynches = Array.from(role.votes)
	await game.execute("lynch", { target: role.identifier, votes: lynches })

	return lynchable
}
