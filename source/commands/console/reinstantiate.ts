import { setTimer } from "../../getTimer"
import deleteTimer from "../../systems/game_reset/deleteTimer"
import loadGame from "../../systems/game_templates/loadGame"
import { ConsoleCommand } from "../CommandType"

const reinstantiate: ConsoleCommand = async (client, config, params) => {
	deleteTimer()

	const timer = await loadGame(client, config, params[0])
	setTimer(timer)

	console.log("Reinstantiated.")
}

export default reinstantiate
