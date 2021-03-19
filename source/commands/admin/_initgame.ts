import getLogger from "../../getLogger"
import { setStatus } from "../../MafiaBot"
import { AdminCommand } from "../CommandType"
import initGame, { GameStartError } from "../../systems/game_setters/initGame"

const _initgame: AdminCommand = async (message, params, config) => {
	const logger = getLogger()

	try {
		await initGame(message.client, config)
	} catch (err) {
		if (err instanceof GameStartError) {
			await message.reply(":x: Failed to create game: " + err.message)
		} else {
			logger.log(4, "Game creation failed.")
			logger.logError(err)

			await message.reply(
				":x: Failed to create game. Run `" +
					config["command-prefix"] +
					"_verifysetup` to troubleshoot. Please check the console for full details."
			)
		}
		await setStatus(message.client)
		return
	}
	await message.reply(":ok: Game creation complete!")
}

export = _initgame
