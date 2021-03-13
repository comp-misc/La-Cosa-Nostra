import { getTimer, hasTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"

const fforward: AdminCommand = async (message) => {
	if (!hasTimer() || !["playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return null
	}

	const game = getTimer().game

	message.channel.send(":ok: Forcing fastforward.")

	game.fastforward()
}

export = fforward
