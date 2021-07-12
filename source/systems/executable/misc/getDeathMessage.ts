// Return the death broadcast
import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"
import texts from "./text/texts"

export default (game: Game, player: Player, reason: string): string => {
	let message = texts.death_message

	message = message.replace(new RegExp("{;player}", "g"), player.getDisplayName())
	message = message.replace(new RegExp("{;reason}", "g"), reason)
	message = message.replace(new RegExp("{;role}", "g"), player.role.getDeathName())

	if (player.time_of_death == undefined) {
		player.time_of_death = game.getPeriod() + 0.1
	}

	let will = "We could not find a last will."

	if (player.will) {
		will = "We found a will next to their body:\n```fix\n" + player.will + "```"
	}

	message = message.replace(new RegExp("{;will_message}", "g"), will)

	// Remove trailing
	// eslint-disable-next-line no-control-regex
	message = message.replace(new RegExp("[\n]*$", "g"), "")

	message = message.replace(new RegExp("{@player}", "g"), "<@" + player.id + ">")

	return message
}
