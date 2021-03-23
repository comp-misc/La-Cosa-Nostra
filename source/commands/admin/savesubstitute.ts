import { getTimer, hasTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"

const savesubstitute: AdminCommand = async (message, params) => {
	if (!hasTimer()) {
		await message.channel.send(":x: No instance loaded.")
		return
	}

	const timer = getTimer()
	const game = timer.game
	const player = game.getPlayer(params[0])
	if (!player) {
		await message.channel.send(":x: Cannot find player to substitute!")
		return
	}

	await game.substitute(params[0], params[1], false)
	game.save()

	await message.channel.send(":ok: Save substitution complete (" + params[0] + " → " + params[1] + ").")

	await message.channel.send(
		":exclamation: Because the substitution only accounts for the bot, please:\n(1) Manually assign roles\n(2) Manually assign nickname\n(3) Manually assign channels\n\n**The completed substitution only accounts for meta-votes.**"
	)
}

export = savesubstitute
