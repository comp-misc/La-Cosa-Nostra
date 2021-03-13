import deleteTimer from "../../systems/game_reset/deleteTimer"
import { ConsoleCommand } from "../CommandType"

const unload: ConsoleCommand = (client) => {
	deleteTimer()

	client.user.setPresence({
		status: "online",
		game: { name: "Game unloaded", type: "PLAYING" },
	})
}

export = unload
