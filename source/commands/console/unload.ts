import updatePresence from "../../systems/executable_misc/updatePresence"
import deleteTimer from "../../systems/game_reset/deleteTimer"
import { ConsoleCommand } from "../CommandType"

const unload: ConsoleCommand = async (client) => {
	deleteTimer()

	await updatePresence(client, {
		status: "online",
		activity: {
			name: "Game unloaded",
			type: "PLAYING",
		},
	})
}

export = unload
