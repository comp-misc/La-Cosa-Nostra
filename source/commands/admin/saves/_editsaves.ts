import util from "util"
import jsonReviver from "../../../auxils/jsonReviver"
import { getTimer, hasTimer } from "../../../getTimer"
import Game from "../../../systems/game_templates/Game"
import { AdminCommand } from "../../CommandType"

const setLocantValue = (json: unknown, reg: string[], value: string) => {
	const region = Array.from(reg)

	// Recursive
	if (region.length < 1) {
		if (value === "____delete@@") {
			// eslint-disable-next-line no-delete-var
			return {}
		} else {
			json = value
		}
		return json
	}

	const key = region.splice(0, 1)
	const jsonAsRecord = json as Record<string, unknown>
	jsonAsRecord[key[0]] = setLocantValue(jsonAsRecord[key[0]], region, value)
	return json
}

const _editsaves: AdminCommand = async (message, params, config) => {
	if (!hasTimer()) {
		await message.channel.send(":x: No savable instance to check.")
		return
	}

	params = params || []

	if (params.length < 2) {
		await message.channel.send(
			":x: Wrong syntax! Use `" + config["command-prefix"] + "_editsaves <region> <value>` instead!"
		)
		return
	}

	const timer = getTimer()
	let locant: unknown = timer.game

	const region = params[0].replace("%space%", " ").split(".")
	for (let i = 0; i < region.length; i++) {
		const key = region[i]

		if (!(locant as Record<string, unknown>)[key] && i < region.length - 1) {
			await message.channel.send(":x: `" + region.join(".") + "` is not a valid field.")
			return
		}

		const locant_descriptor = Object.getOwnPropertyDescriptor(locant, key)

		if (locant_descriptor && (!locant_descriptor.writable || !locant_descriptor.enumerable)) {
			await message.channel.send(":x: That property is not writable.")
			return
		}

		locant = (locant as Record<string, unknown>)[key]
	}

	let value: string
	try {
		value = params.splice(1, Infinity).join(" ")

		if (value.toLowerCase() === "delete") {
			value = "____delete@@"
		} else {
			value = JSON.parse(value, jsonReviver) as string
		}
	} catch (err) {
		await message.channel.send(":x: Invalid property.\n```fix\n" + (err as Error).message + "```")
		return
	}

	timer.game = setLocantValue(timer.game, region, value) as Game
	await timer.game.save()

	let output: string
	if (value === "____delete@@") {
		output = ":ok: Deleted and saved value for `" + region.join(".") + "`"
	} else {
		output =
			":ok: Set and saved value for `" +
			region.join(".") +
			"` to:\n```js\n" +
			util.inspect(value, false, 0, false) +
			"```"
	}

	if (output.length < 2000) {
		await message.channel.send(output)
	} else {
		await message.channel.send(
			":ok: Set and saved value for `" + region.join(".") + "`. Cannot display value as it is too long."
		)
	}
}

export default _editsaves
