import getLogger from "../../getLogger"
import { setStatus } from "../../MafiaBot"
import { AdminCommand } from "../CommandType"
import initGame from "../../systems/game_setters/initGame"

const _initgame: AdminCommand = async (message, params, config) => {
	const logger = getLogger()
	await message.channel.send(":ok: Creating game.")

	try {
		await initGame(message.client, config)
	} catch (err) {
		logger.log(4, "Game creation failed.")
		logger.logError(err)

		await message.channel.send(
			":x: Failed to create game. Run `" +
				config["command-prefix"] +
				"_verifysetup` to troubleshoot. Please check the console for full details."
		)

		await setStatus(message.client)
		return
	}

	await message.channel.send(":ok: Game creation complete.")
}

export = _initgame
