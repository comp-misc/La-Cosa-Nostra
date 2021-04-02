import format from "./__formatter"
import texts from "./text/texts"
import Game from "../../game_templates/Game"
import formatUTCDate from "../../../auxils/formatUTCDate"

const getSetupSettings = (game: Game) => {
	let message =
		"**Game Settings**\nDay lengths: " +
		game.config["time"]["day"] +
		" hours\nNight lengths: " +
		game.config["time"]["night"] +
		" hours\n\nThe game starts with __"

	if (game.config.game["day-zero"]) {
		message = message + "daytime__.\n\n"
	} else {
		message = message + "night-time__.\n\n"
	}

	if (game.config.game["last-wills"].allow || game.config.game.whispers.allow) {
		if (!game.config.game["last-wills"].allow) {
			message = message + "__Last wills__ are on.\n\n**Lynch Settings**\nCondition: \n\n"
		} else {
			if (!game.config.game.whispers.allow) {
				message = message + "__Whispers__ are on.\n\n**Lynch Settings**\nCondition: \n\n"
			} else {
				message = message + "__Last wills__ and __whispers__ are on.\n\n**Lynch Settings**\nCondition: \n\n"
			}
		}
	} else {
		message = message + "**Lynch Settings**\nCondition: "
	}

	if (game.config.game.lynch["top-voted-lynch"]) {
		message = message + "__top-voted-lynch__"

		if (game.config.game.lynch["top-voted-lynch-minimum-votes"] > 1) {
			message =
				message + " (minimum " + game.config.game.lynch["top-voted-lynch-minimum-votes"] + " votes required)"
		}
	} else {
		message = message + "__majority-vote__"
	}

	if (game.config.game.lynch["allow-hammer"]) {
		message = message + "\nHammer on: true"
	} else {
		message = message + "\nHammer on: false"
	}

	if (game.config.game.lynch["tied-random"]) {
		message = message + "\nTied vote: randomly determined"
	} else {
		message = message + "\nTied-vote: no-lynch"
	}

	return message
}

const postPrimeMessage = async (game: Game): Promise<void> => {
	let message = texts.prime
	const config = game.config

	message = message.replace("{;setup_name}", format(game, config.messages.name))
	message = message.replace("{;settings}", getSetupSettings(game))
	message = message.replace(new RegExp("{;current_utc_formatted}", "g"), formatUTCDate(new Date()))

	const players = game.players
	const concat = []

	for (const player of players) {
		const display_name = player.getDisplayName()
		const text = "**" + display_name + "**"

		concat.push(text)
	}

	message = message.replace(new RegExp("{;players}", "g"), concat.join("\n"))

	await game.getLogChannel().send(format(game, message))
}

export default postPrimeMessage
