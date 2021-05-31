import { getTimer, hasTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const clearallvotes: AdminCommand = async (message) => {
	if (!hasTimer() || !["playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}

	const game = getTimer().game
	game.players.forEach((player) => player.clearVotes())

	game.clearNoLynchVotes()

	if (game.isDay()) {
		await game.reloadTrialVoteMessage()
	}

	await game.save()

	await message.channel.send(":ok: All votes cleared.")
}

export default makeCommand(clearallvotes, {
	name: "clearallvotes",
	description: "Clears all votes",
})
