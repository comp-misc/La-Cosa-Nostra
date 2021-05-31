import Game from "../../systems/game_templates/Game"

const clearModuleActions = (game: Game, user_identifier: string, type: string): void => {
	game.actions.delete(
		(x) => !!x.meta && (x.meta as Record<string, unknown>).type === type && x.from === user_identifier
	)
}

export default clearModuleActions
