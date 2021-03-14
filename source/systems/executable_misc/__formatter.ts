// format messages

/*

LEGEND:

# - channel
@ - ping role
! - special
+ - vocab {+[term]|[key]} followed by special
; - do not use

*/

import auxils from "../auxils"
import Game from "../game_templates/Game"

const getParameters = (game: Game) => {
	const config = game.config
	return {
		alive: game.getAlive(),
		day_hours: config.time.day,
		night_hours: config.time.night,
		utc_formatted: auxils.formatUTCDate(game.current_time as Date),
		next_utc_formatted: auxils.formatUTCDate(game.next_action as Date),
		now_utc: auxils.formatUTCDate(new Date()),
		game_chronos: game.getFormattedDay().toUpperCase(),
		game_chronos_next: game.getFormattedDay(1),
		game_chronos_last: game.getFormattedDay(-1),
		cycle: game.isDay() ? "daytime" : "nighttime",
		trials_left: game.getTrialsAvailable(),
		votes_required: game.getVotesRequired(),
		nolynch_votes_required: game.getNoLynchVotesRequired(),
	}
}

export = (game: Game, message: string): string => {
	// Ping roles

	const config = game.config
	const guild = game.getGuild()
	const parameters = getParameters(game)

	Object.entries(config.permissions).forEach(([role, name]) => {
		// Check for pings
		const search = "{@" + role + "}"

		if (message.includes(search)) {
			const role = guild.roles.cache.find((x) => x.name === name)

			if (role) {
				// Set the ping
				message = message.replace(new RegExp(search, "g"), "<@&" + role.id + ">")
			}
		}
	})

	Object.entries(config.channels).forEach(([type, name]) => {
		const search = "{#" + type + "}"
		const channel = guild.channels.cache.find((x) => x.name === name)

		if (channel) {
			message = message.replace(new RegExp(search, "g"), "<#" + channel.id + ">")
		}
	})

	Object.entries(parameters).forEach(([key, value]) => {
		message = message.replace(new RegExp("{!" + key + "}", "g"), value.toString())
	})

	// Vocabulary
	let regex = new RegExp("{\\+([A-z]+)\\|(.*?)}", "g")
	const matches = message.match(regex) || []

	for (let i = 0; i < matches.length; i++) {
		regex = new RegExp("{\\+([A-z]+)\\|(.*?)}", "g")

		const catches = regex.exec(matches[i])
		if (!catches) {
			continue
		}

		const grammar = catches[1]
		const param = (parameters as Record<string, any>)[catches[2]]

		message = message.replace(matches[i], auxils.vocab(grammar, param))
	}

	Object.entries(config.messages).forEach(([name, msg]) => {
		message = message.replace(new RegExp("{#" + name + "}", "g"), msg)
	})
	return message
}
