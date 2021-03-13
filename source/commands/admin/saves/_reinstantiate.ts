import { AdminCommand } from "../../CommandType"
import Timer from "../../../systems/game_templates/Timer"
import deleteTimer from "../../../systems/game_reset/deleteTimer"

const _reinstate: AdminCommand = async (message, params, config) => {
	const client = message.client

	deleteTimer()

	const timer = Timer.load(client, config)

	;(process as any).timer = timer

	await message.channel.send(":ok: Reloaded save into file and primed the game timer.")
}

export = _reinstate
