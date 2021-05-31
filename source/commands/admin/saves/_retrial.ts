import { hasTimer, getTimer } from "../../../getTimer"
import { AdminCommand } from "../../CommandType"

const _retrial: AdminCommand = async (message) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}

	const game = getTimer().game

	if (!game.isDay()) {
		await message.channel.send(":x: You may only recreate a trial during the day.")
		return
	}

	// Do not load pre-emptives
	await game.createTrialVote(false)

	game.clearTrialVoteCollectors()
	game.voting_halted = false

	await message.channel.send(":ok: Trial vote recreated. Please ensure that reaction votes are functional.")
}

export default _retrial
