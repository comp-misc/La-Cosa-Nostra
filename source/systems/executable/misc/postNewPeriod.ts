import texts from "./text/texts"
import format from "./__formatter"

import pinMessage from "./pinMessage"
import Game from "../../game_templates/Game"

const getDayNightTime = (game: Game): string => {
	if ((game.period - 1) % 2 === 0) {
		return "Day " + (game.getPeriod() - 1) / 2
	} else {
		return "Night " + game.getPeriod() / 2
	}
}

//Day 0 conclusion: 1
//Night 1 conclusion: 2
//Day 1 conclusion: 3
//Night 2 conclusion: 4
//Day 2 conclusion: 5
//Night 3 conclusion: 6
//Day 3 conclusion: 7

const getDayNightQuote = (game: Game): string => {
	if (game.getPeriod() % 2 === 0) {
		return "*As the sun is rising over the horizon the town uncovers the events of the night.*"
	} else {
		return "*After an eventful day and some consideration, the town finally comes to a conclusion.*"
	}
}

const getAliveTag = (game: Game): string => {
	if (game.getPeriod() % 2 === 1) {
		return "\nIt is now __night-time__.\n\n{@alive}"
	} else {
		return "** **"
	}
}

export = async (game: Game, broadcast?: string): Promise<void> => {
	// Post periodic log
	const log = game.getLogChannel()
	const main = game.getMainChannel()
	const post = game.getWhisperLogChannel()

	if (!broadcast) {
		if ((game.getPeriod() - 1) % 2 == 1) {
			broadcast = "> {#no-summary}"
		} else {
			broadcast = "> {#no-summary-day}"
		}
	}

	let sendable = texts.new_period

	sendable = sendable.replace("{;game_chronos}", getDayNightTime(game))
	sendable = sendable.replace("{;short_quote}", getDayNightQuote(game))
	sendable = sendable.replace(new RegExp("{;summary}", "g"), broadcast)
	sendable = sendable.replace("{;alive_tag}", getAliveTag(game))

	await log.send(format(game, sendable))

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

	await pinMessage(main_pinnable)
	await pinMessage(post_pinnable)

	if (game.getPeriod() % 2 === 0) {
		await main.send(format(game, game.config["messages"]["daytime-quote"]))
	} else {
		await main.send(format(game, game.config["messages"]["nighttime-quote"]))
	}
}
