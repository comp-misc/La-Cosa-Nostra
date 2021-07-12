import { getTimer, hasTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const listActionables: AdminCommand = async (message) => {
	if (!hasTimer() || !["pre-game", "playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}
	const actionables = Object.keys(getTimer().game.actions.actionables)
	if (actionables.length === 0) {
		await message.reply(":warning: No actionables are loaded")
	} else {
		await message.reply(
			"The following actionables are loaded: ```fix!\n" + actionables.map((a) => " - " + a).join("\n") + "\n```"
		)
	}
}

export default makeCommand(listActionables, {
	name: "_list_actionables",
	description: "Lists all registered actionables",
	aliases: ["_list-actionables"],
})
