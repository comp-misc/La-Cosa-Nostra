// Return the death broadcast

import texts from "./text/texts"
import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"

export = function (game: Game, role: Player, reason: string): string {
	let message = texts.death_message

	message = message.replace(new RegExp("{;player}", "g"), role.getDisplayName())
	message = message.replace(new RegExp("{;reason}", "g"), reason)
	message = message.replace(new RegExp("{;role}", "g"), role.getDisplayRole())

	if (role.misc.time_of_death == undefined) {
		role.misc.time_of_death = game.getPeriod() + 0.1
	}

	let will = "We could not find a last will."

	if (role.will) {
		will = "We found a will next to their body:\n```fix\n" + role.will + "```"
	}

	message = message.replace(new RegExp("{;will_message}", "g"), will)

	// Remove trailing
	// eslint-disable-next-line no-control-regex
	message = message.replace(new RegExp("[\n]*$", "g"), "")

	message = message.replace(new RegExp("{@player}", "g"), "<@" + role.id + ">")

	return message
}
