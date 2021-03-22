import Game from "../../game_templates/Game"
import setRoles from "./setRoles"

export = async (game: Game): Promise<void> => setRoles(game)
