import { getTimer, hasTimer, setTimer } from "../../../getTimer"
import deleteTimer from "../../../systems/game_reset/deleteTimer"
import loadGame from "../../../systems/game_templates/loadGame"
import { AdminCommand } from "../../CommandType"
import makeCommand from "../../makeCommand"

const reload: AdminCommand = async (message, _params, config) => {
	const client = message.client

	if (!hasTimer()) {
		await message.channel.send(":x: No savable instance.")
		return
	}

	await getTimer().game.save()

	await message.channel.send(
		":ok: Saved the game. Should the bot crash, please reload manually using `!_unload` and then `!_reinstantiate`."
	)

	deleteTimer()

	const timer = await loadGame(client, config)
	setTimer(timer)

	await message.channel.send(":ok: Reloaded.")
}

export default makeCommand(reload, {
	name: "_reload",
	description: "Reloads the bot",
})
