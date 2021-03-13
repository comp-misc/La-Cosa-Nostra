import { hasTimer, getTimer } from "../../getTimer"
import auxils from "../../systems/auxils"
import { AdminCommand } from "../CommandType"

const _attributes: AdminCommand = async (message, params, config) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}

	if (params.length < 1) {
		await message.channel.send(":x: Wrong syntax! Use `" + config["command-prefix"] + "_attributes <id>` instead!")
		return null
	}

	const game = getTimer().game

	const player = game.getPlayerById(params[0])

	if (!player) {
		await message.channel.send(":x: Invalid player!")
		return null
	}

	const attributes = player.attributes

	let sendable: string[] = []
	if (attributes.length > 0) {
		sendable = attributes.map(
			(x, i) => "Attribute **[" + (i + 1) + "]**:\n" + "```fix\n" + JSON.stringify(x, auxils.jsonInfinityCensor) + "```"
		)
	} else {
		sendable = [":x: No attributes found!"]
	}

	await message.channel.send(sendable.join("\n"), { split: { char: "\n```", prepend: "\n```" } })
}

export = _attributes
