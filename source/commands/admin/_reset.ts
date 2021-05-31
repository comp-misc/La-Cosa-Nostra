import { AdminCommand } from "../CommandType"
import reset from "../../systems/game_reset/reset"

const _reset: AdminCommand = async (message, params, config) => {
	await message.channel.send(":ok:  Resetting.")

	await reset(message.client, config)
	await message.channel.send(":ok:  Reset.")
}

export default _reset
