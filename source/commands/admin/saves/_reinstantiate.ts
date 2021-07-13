import { setTimer } from "../../../getTimer"
import deleteTimer from "../../../systems/game_reset/deleteTimer"
import loadGame from "../../../systems/game_templates/loadGame"
import { AdminCommand } from "../../CommandType"

const _reinstate: AdminCommand = async (message, params, config) => {
	const client = message.client

	const timer = await loadGame(client, config, params[0])
	deleteTimer()
	setTimer(timer)

	await message.channel.send(":ok: Reloaded save into file and primed the game timer.")
}

export default _reinstate
