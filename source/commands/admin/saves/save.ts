import { getTimer, hasTimer } from "../../../getTimer"
import { AdminCommand } from "../../CommandType"

const save: AdminCommand = async (message) => {
	if (!hasTimer()) {
		await message.channel.send(":x: No savable instance.")
		return
	}

	getTimer().game.save()

	await message.channel.send(":ok: Saved the game.")
}

export = save
