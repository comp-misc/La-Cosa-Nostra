import { getTimer, hasTimer } from "../../getTimer"
import auxils from "../../systems/auxils"
import { AdminCommand } from "../CommandType"

const deadline: AdminCommand = async (message, params, config) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}

	const game = getTimer().game

	if (params.length < 2) {
		await message.channel.send(
			":x: Wrong syntax! Use `" +
				config["command-prefix"] +
				"deadline <set/change> <Unix timestamp/seconds>` instead!"
		)
		return
	}

	let date: Date
	switch (params[0].toLowerCase()) {
		case "set": {
			// Set to epoch directly
			const epoch = parseInt(params[1])

			if (isNaN(epoch)) {
				await message.channel.send(":x: Epoch time is invalid.")
				return
			}
			date = new Date(epoch * 1000)
			break
		}
		case "change": {
			// Calculate a delta
			const delta = parseInt(params[1])

			if (isNaN(delta)) {
				await message.channel.send(":x: Epoch time is invalid.")
				return
			}
			const nextAction = game.next_action
			if (!nextAction) {
				await message.channel.send(":exclamation: No next action time found")
				return
			}
			date = new Date(nextAction.getTime() + delta * 1000)
			break
		}
		default:
			await message.channel.send(
				":x: Wrong syntax! Use `" +
					config["command-prefix"] +
					"deadline <set/change> <epoch/milliseconds>` instead!"
			)
			return
	}

	const max = 2147483647
	const difference = date.getTime() - new Date().getTime()

	if (difference > max) {
		await message.channel.send(`:x: You may not increase the deadline by more than ${max / 1000} seconds!`)
		return
	}

	if (difference <= 0) {
		await message.channel.send(
			":x: That would make the deadline before now! Use `" +
				config["command-prefix"] +
				"step` if you want the game to cycle immediately instead!"
		)
		return
	}

	game.next_action = date

	// Reprime the timer and save
	await getTimer().prime()
	await game.save()

	await message.channel.send(":ok: Set new deadline to **" + auxils.formatUTCDate(game.next_action) + "**.")
}

export default deadline
