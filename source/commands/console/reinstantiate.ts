import deleteTimer from "../../systems/game_reset/deleteTimer"
import Timer from "../../systems/game_templates/Timer"
import { ConsoleCommand } from "../CommandType"

const reinstantiate: ConsoleCommand = (client, config) => {
	deleteTimer()

	const timer = Timer.load(client, config)
	;(process as any).timer = timer

	console.log("Reinstantiated.")
}

export = reinstantiate
