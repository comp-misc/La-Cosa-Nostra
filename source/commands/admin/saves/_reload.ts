import { getTimer, hasTimer } from "../../../getTimer"
import deleteTimer from "../../../systems/game_reset/deleteTimer"
import Timer from "../../../systems/game_templates/Timer"
import { AdminCommand } from "../../CommandType"

const _reload: AdminCommand = async (message, params, config) => {
	const client = message.client

	if (!hasTimer()) {
		await message.channel.send(":x: No savable instance.")
		return null
	}

	getTimer().game.save()

	await message.channel.send(
		":ok: Saved the game. Should the bot crash, please reload manually using `!_unload` and then `!_reinstantiate`."
	)

	deleteTimer()

	const timer = Timer.load(client, config)

	;(process as any).timer = timer

	await message.channel.send(":ok: Reloaded.")
}

export = _reload
