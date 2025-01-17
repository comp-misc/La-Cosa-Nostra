// I know I probably should have these
// stored as methods to the class;
// but I want to keep them separate
// because partial classes in JS suck

import auxils from "../../auxils"
import Game from "../../game_templates/Game"
import pinMessage from "./pinMessage"
import texts from "./text/texts"
import format from "./__formatter"

const getDayOrNight = (game: Game): string => {
	if (game.getPeriod() % 2 == 0) {
		return "__daytime__.\n** **"
	} else {
		return "__night-time__."
	}
}

export default async (game: Game): Promise<void> => {
	const config = game.config

	const log = game.getLogChannel()
	const main = game.getMainChannel()
	const post = game.getWhisperLogChannel()

	// Send the start message
	const attachment = auxils.getAssetAttachment("game-start.jpg")

	const intro = await main.send(format(game, config.messages["game-start"]))
	await main.send(undefined, attachment)

	const whisper_intro = await post.send(format(game, config.messages["whisper-log"]))

	let message = texts.opening
	message = message.replace("{;opening_quote}", config.messages["opening-quote"])
	message = message.replace("{;day_or_night}", getDayOrNight(game))

	await log.send(format(game, message))

	const main_pinnable = await main.send(
		"**" +
			game.getFormattedDay() +
			"**    ~~                                                                                            ~~"
	)
	const post_pinnable = await post.send(
		"**" +
			game.getFormattedDay() +
			"**    ~~                                                                                            ~~"
	)

	if (game.period % 2 === 0) {
		await main.send(format(game, config.messages["daytime-quote"]))
	} else {
		await main.send(format(game, config.messages["nighttime-quote"]))
	}

	await pinMessage(intro)
	await pinMessage(whisper_intro)

	await pinMessage(main_pinnable)
	await pinMessage(post_pinnable)

	if (game.channels.mafia !== undefined) {
		const mafia_channel = game.getChannel("mafia")
		const mafia_pinnable = await mafia_channel.send(config.messages.mafia)
		await pinMessage(mafia_pinnable)
	}

	await game.postIntroMessages()
}
