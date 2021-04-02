import deleteTimer from "../../systems/game_reset/deleteTimer"
import Timer from "../../systems/game_templates/Timer"
import { ConsoleCommand } from "../CommandType"
import { setTimer } from "../../getTimer"

const reinstantiate: ConsoleCommand = async (client, config, params) => {
	deleteTimer()

	const timer = await Timer.load(client, config, params[0])
	setTimer(timer)

	console.log("Reinstantiated.")
}

export = reinstantiate
