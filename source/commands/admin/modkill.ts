import { hasTimer, getTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"

const modkill: AdminCommand = async (message, params) => {
	if (!hasTimer() || !["playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}
	const game = getTimer().game
	const config = game.config

	if (params.length !== 1) {
		await message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "modkill <id>` instead!")
		return
	}

	const id = params[0]

	const player = game.getPlayer(id)
	if (!player) {
		await message.channel.send(":x: Unable to find player")
		return
	}

	const response = await game.modkill(player)

	if (response) {
		await message.channel.send(":ok:  Modkilled **" + player.getDisplayName() + "**!")

		player.misc.time_of_death = game.getPeriod() + 0.05
	} else {
		await message.channel.send(":x:  Could not modkill player.")
	}
}

export = modkill
