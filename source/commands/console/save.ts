import { ConsoleCommand } from "../CommandType"
import { getTimer, hasTimer } from "../../getTimer"
import makeCommand from "../makeCommand"

const save: ConsoleCommand = async (client, config, params) => {
	if (!hasTimer()) {
		console.error("No savable instance.")
		return
	}
	await getTimer().game.save(params[0])

	console.log("Saved the game.")
}

export default makeCommand(save, {
	name: "save",
	description: "Saves the game state",
	usage: "save [name]",
})
