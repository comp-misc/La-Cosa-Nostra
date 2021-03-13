import { getTimer, hasTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"

const clearallvotes: AdminCommand = async (message) => {
	if (!hasTimer() || !["playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return null
	}

	const game = getTimer().game
	game.players.forEach((player) => player.clearVotes())

	game.clearNoLynchVotes()

	if (game.isDay()) {
		game.reloadTrialVoteMessage()
	}

	game.save()

	await message.channel.send(":ok: All votes cleared.")
}

export = clearallvotes
