import reset from "../../../systems/game_reset/reset"
import { AdminCommand } from "../../CommandType"

const _reset: AdminCommand = async (message, params, config) => {
	await message.channel.send(":hourglass_flowing_sand: Resetting, please wait. This may take a while.")

	await reset(message.client, config)

	await message.channel.send(":ok: Game reset.")
}

export = _reset
