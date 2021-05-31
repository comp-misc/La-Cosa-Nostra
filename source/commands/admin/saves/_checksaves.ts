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

	let locant: Record<string, unknown> = timer.game as unknown as Record<string, unknown>

	const region = params.length > 1 ? params.splice(1, Infinity).join(" ").replace("%space%", " ").split(".") : []

	for (const key of region) {
		if (!(key in locant)) {
			await message.channel.send(":x: `" + region.join(".") + "` is not a valid field.")
			return
		}

		// eslint-disable-next-line no-prototype-builtins
		if (!locant.propertyIsEnumerable(key)) {
			await message.channel.send(":x: Don't try to access restricted areas of the saves! Naughty!")
			return
		}

		locant = locant[key] as Record<string, unknown>
	}

	const output = util.inspect(locant, false, depth, false)

	const sendable =
		"**Saves output at `[Game]" +
		(region.length > 0 ? "." + region.join(".") : "") +
		"`** `[depth = " +
		depth.toString() +
		"]`:\n```js\n" +
		output +
		"```"

	if (sendable.length >= 2000) {
		await message.channel.send(
			":x: The enumeration is too long to fit into a single message. Try with a smaller depth!"
		)
		return
	}

	await message.channel.send(sendable)
}

export default _checksaves
