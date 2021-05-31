import auxils from "../../systems/auxils"
import { GameCommand } from "../CommandType"

const time: GameCommand = async (game, message) => {
	const timer = game.timer
	if (!timer) {
		await message.channel.send(":x:  A game is not active")
		return
	}

	const current = new Date()
	const designation = timer.designated
	if (!designation) {
		await message.channel.send(":x:  No designated time")
		return
	}

	// Work in progress
	const delta = designation.getTime() - current.getTime()

	if (delta < 1000) {
		await message.channel.send(":clock12:  Time is up.")
		return
	}

	const formatted = auxils.formatDate(delta)

	if (game.state === "pre-game") {
		await message.channel.send(":clock12:  **" + formatted + "** left before game starts.")
	} else {
		await message.channel.send(":clock12:  **" + formatted + "** left before **" + game.getFormattedDay(1) + "**.")
	}
}

time.ALLOW_PREGAME = true
time.ALLOW_GAME = true
time.ALLOW_POSTGAME = false

export default time
