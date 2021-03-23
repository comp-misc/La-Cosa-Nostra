import getLogger from "../../getLogger"
import { hasTimer, getTimer } from "../../getTimer"
import attributes from "../../systems/attributes"
import { AdminCommand } from "../CommandType"

const addattribute: AdminCommand = async (message, params, config) => {
	if (!hasTimer() || !["playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return null
	}

	const logger = getLogger()
	const game = getTimer().game

	if (params.length < 2) {
		await message.channel.send(
			":x: Wrong syntax! Please use `" +
				config["command-prefix"] +
				"addattribute <id> <attribute> [expiry=Infinity] [tags]` instead!"
		)
		return
	}

	const player = game.getPlayer(params[0])

	if (!player) {
		await message.channel.send(":x: Invalid player.")
		return
	}

	const attribute = attributes[params[1]]

	if (!attribute) {
		await message.channel.send(":x: Invalid attribute identifier `" + attribute + "`!")
		return
	}

	const expiry = !params[2] || params[2].toLowerCase() === "infinity" ? Infinity : parseInt(params[2])

	if (isNaN(expiry)) {
		await message.channel.send(":x: Invalid expiry!")
		return
	}

	const json_string = params.splice(3).join(" ")

	let tags: Record<string, unknown> | undefined = undefined
	if (json_string.length > 0) {
		try {
			tags = JSON.parse(json_string)
		} catch (err) {
			logger.logError(err)
			await message.channel.send(":x: Invalid JSON tags string.")
			return
		}
	}

	player.addAttribute(params[1], expiry, tags)

	await message.channel.send(
		":ok: Added attribute `" +
			params[1] +
			"` with a cycle-expiry of `" +
			expiry +
			"` to **" +
			player.getDisplayName() +
			"**."
	)
}

export = addattribute
