import updatePresence from "../../../systems/executable/misc/updatePresence"
import deleteTimer from "../../../systems/game_reset/deleteTimer"
import { AdminCommand } from "../../CommandType"

const _unload: AdminCommand = async (message, params, config) => {
	const client = message.client

	deleteTimer()

	await updatePresence(client, {
		status: "online",
		activity: { name: "Game unloaded", type: "PLAYING" },
	})

	await message.channel.send(
		":ok: Unloaded current instance. Reload with `" + config["command-prefix"] + "_reinstantiate`"
	)
}

export default _unload
