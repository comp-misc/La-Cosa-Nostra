import { getTimer, hasTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const substitute: AdminCommand = async (message, params) => {
	if (!hasTimer()) {
		await message.channel.send(":x: No instance loaded.")
		return
	}

	const timer = getTimer()
	const game = timer.game

	if (!game.getPlayer(params[0])) {
		await message.channel.send(":x: Cannot find player to substitute!")
		return
	}

	await game.substitute(params[0], params[1], true)

	if (game.isDay()) {
		await game.reloadTrialVoteMessage()
	}

	game.save()

	await message.channel.send(":ok: Substitution complete (" + params[0] + " → " + params[1] + ").")
	await message.channel.send(
		":exclamation: Please ensure that the substituted player has correct access to all the channels."
	)
}

export default makeCommand(substitute, {
	name: "substitute",
	description: "Substitutes a player",
	usage: "!substitute <current player id> <new player id>",
})
