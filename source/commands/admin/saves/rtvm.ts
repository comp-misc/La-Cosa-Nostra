import { getTimer, hasTimer } from "../../../getTimer"
import { AdminCommand } from "../../CommandType"

const rtvm: AdminCommand = async (message) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game going on.")
		return
	}

	const game = getTimer().game

	if (!game.isDay()) {
		await message.channel.send(":x: You may only reload the trial vote message during the day.")
		return
	}

	game.reloadTrialVoteMessage()
	await message.channel.send(":ok: Reloaded the trial vote message.")
}

export = rtvm
