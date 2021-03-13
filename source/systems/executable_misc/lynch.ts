import Game from "../game_templates/Game"
import Player from "../game_templates/Player"

export = (game: Game, role: Player): boolean => {
	const lynchable = role.lynchable()

	if (!lynchable) {
		return false
	}

	const lynches = Array.from(role.votes)
	game.execute("lynch", { target: role.identifier, votes: lynches })

	return lynchable
}
