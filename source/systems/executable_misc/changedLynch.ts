import { Snowflake } from "discord.js"
import getLogger from "../../getLogger"
import Game from "../game_templates/Game"
import texts from "./text/texts"

export = async (game: Game, from: Snowflake, to: Snowflake): Promise<void> => {
	const logger = getLogger()
	const main = game.getMainChannel()

	const voter = main.members.get(from)
	const voted = main.members.get(to)

	let message = texts.changed_lynch

	if (!voted) {
		logger.log(1, "Undefined member on voted user. Debugging?")
		return
	}
	if (!voter) {
		logger.log(1, "Undefined member on voter")
		return
	}

	message = message.replace(new RegExp("{;voter}", "g"), voter.displayName)
	message = message.replace(new RegExp("{;voted}", "g"), voted.displayName)

	await main.send(message)
}
