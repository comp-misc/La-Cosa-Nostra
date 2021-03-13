import deleteTimer from "../../../systems/game_reset/deleteTimer"
import { AdminCommand } from "../../CommandType"

const _unload: AdminCommand = async (message, params, config) => {
	const client = message.client

	deleteTimer()

	await client.user.setPresence({
		status: "online",
		game: { name: "Game unloaded", type: "PLAYING" },
	})

	await message.channel.send(
		":ok: Unloaded current instance. Reload with `" + config["command-prefix"] + "_reinstantiate`"
	)
}

export = _unload
