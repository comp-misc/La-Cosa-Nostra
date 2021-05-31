import { AdminCommand } from "../../CommandType"
import loadGame from "../../../systems/game_templates/loadGame"
import deleteTimer from "../../../systems/game_reset/deleteTimer"
import { setTimer } from "../../../getTimer"

const _reinstate: AdminCommand = async (message, params, config) => {
	const client = message.client

	deleteTimer()

	const timer = await loadGame(client, config, params[0])
	setTimer(timer)

	await message.channel.send(":ok: Reloaded save into file and primed the game timer.")
}

export default _reinstate
