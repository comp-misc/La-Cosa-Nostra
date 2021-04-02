import { hasTimer, getTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"

const step: AdminCommand = async (message) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}
	const timer = getTimer()

	await message.channel.send(":ok: Setting a step in the Timer.")
	await timer.step()
}

export = step