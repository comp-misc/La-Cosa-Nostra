import Game from "../../systems/game_templates/Game"

const clearModuleActions = (game: Game, user_identifier: string, type: string): void => {
	game.actions.delete((x) => !!x.meta && (x.meta as any).type === type && (x as any).from === user_identifier)
}

export = clearModuleActions
