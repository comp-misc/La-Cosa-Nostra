import format from "./__formatter"
import texts from "./text/texts"
import auxils from "../../auxils"
import Game from "../../game_templates/Game"

export = async (game: Game): Promise<void> => {
	let message = texts.delay_notice

	message = message.replace(new RegExp("{;current_utc_formatted}"), auxils.formatUTCDate(new Date()))

	await game.getLogChannel().send(format(game, message))
}
