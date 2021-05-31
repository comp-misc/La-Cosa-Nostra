import getLogger from "../../getLogger"
import { setStatus } from "../../MafiaBot"
import init, { GameStartError } from "../../systems/game_setters/initGame"
import { ConsoleCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const initGame: ConsoleCommand = async (client, config) => {
	try {
		await init(client, config)
	} catch (e) {
		if (e instanceof GameStartError) {
			console.error("Failed to create game: " + e.message)
		} else {
			const logger = getLogger()
			logger.log(4, "Game creation failed.")
			logger.logError(e)

			console.error(
				"Failed to create game. Run `" + config["command-prefix"] + "_verifysetup` on discord to troubleshoot."
			)
		}
		await setStatus(client)
		return
	}
	console.log("Game creation complete!")
}

export default makeCommand(initGame, {
	name: "initgame",
	description: "Initialises a new game",
	aliases: ["_initgame"],
})
