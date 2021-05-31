import { getTimer, hasTimer } from "../../../getTimer"
import { AdminCommand } from "../../CommandType"

const save: AdminCommand = async (message, params) => {
	if (!hasTimer()) {
		await message.channel.send(":x: No savable instance.")
		return
	}

	await getTimer().game.save(params[0])

	await message.channel.send(":ok: Saved the game.")
}

export default save
