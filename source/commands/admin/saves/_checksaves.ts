import util from "util"
import { getTimer, hasTimer } from "../../../getTimer"
import { AdminCommand } from "../../CommandType"

const _checksaves: AdminCommand = async (message, params) => {
	if (!hasTimer()) {
		await message.channel.send(":x: No savable instance to check.")
		return
	}
	const timer = getTimer()

	params = params || []

	if (!params.length || isNaN(parseInt(params[0]))) {
		params.unshift("")
	}

	const depth = parseInt(params[0] || "0") || 0

	let locant: any = timer.game

	const region = params.length > 1 ? params.splice(1, Infinity).join(" ").replace("%space%", " ").split(".") : []

	for (let i = 0; i < region.length; i++) {
		const key = region[i]

		if (!locant[key]) {
			await message.channel.send(":x: `" + region.join(".") + "` is not a valid field.")
			return null
		}

		// eslint-disable-next-line no-prototype-builtins
		if (!locant.propertyIsEnumerable(key)) {
			await message.channel.send(":x: Don't try to access restricted areas of the saves! Naughty!")
			return null
		}

		locant = locant[key]
	}

	const output = util.inspect(locant, false, depth, false)

	const sendable =
		"**Saves output at `[Game]" +
		(region.length > 0 ? "." + region.join(".") : String()) +
		"`** `[depth = " +
		depth +
		"]`:\n```js\n" +
		output +
		"```"

	if (sendable.length >= 2000) {
		await message.channel.send(
			":x: The enumeration is too long to fit into a single message. Try with a smaller depth!"
		)
		return null
	}

	await message.channel.send(sendable)
}

export = _checksaves
