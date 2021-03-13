import { getTimer, hasTimer } from "../../getTimer"
import auxils from "../../systems/auxils"
import { Trigger } from "../../systems/game_templates/Actions"
import { AdminCommand } from "../CommandType"

const _actions: AdminCommand = async (message, params) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}

	let actions = getTimer().game.actions.actions.map((x, index) => ({
		action: x,
		used: true,
		index: index,
	}))

	// Map by tags
	params.forEach((param) => {
		const key = param.toLowerCase()
		if (key === "-*") {
			actions.forEach((x) => (x.used = false))
		} else if (key.startsWith("-")) {
			// Exclude
			const check = key.substring(1, Infinity)
			actions.forEach((x) =>
				x.action.tags.includes(check) ||
				x.action.triggers.includes(check as Trigger) ||
				x.action.identifier.includes(check)
					? (x.used = false)
					: null
			)
		} else {
			actions.forEach((x) =>
				x.action.tags.includes(key) || x.action.triggers.includes(key as Trigger) || x.action.identifier.includes(key)
					? (x.used = true)
					: null
			)
		}
	})

	actions = actions.filter((x) => x.used)

	let sendable: string[]
	if (actions.length > 0) {
		sendable = actions.map(
			(x) => "Index **[" + x.index + "]**:\n" + "```fix\n" + JSON.stringify(x.action, auxils.jsonInfinityCensor) + "```"
		)
	} else {
		sendable = [":x: No actions found!"]
	}

	await message.channel.send(sendable.join("\n"), {
		split: { char: "\n```", prepend: "\n```" },
	})
}

export = _actions
