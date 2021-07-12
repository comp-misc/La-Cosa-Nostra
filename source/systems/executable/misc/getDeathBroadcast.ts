// Return the death broadcast
import Game from "../../game_templates/Game"
import Player from "../../game_templates/Player"
import texts from "./text/texts"

export default (game: Game, player: Player, reason: string): string => {
	let message = texts.death_broadcast

	message = message.replace(new RegExp("{;player}", "g"), player.getDisplayName())
	message = message.replace(new RegExp("{;reason}", "g"), reason)
	message = message.replace(new RegExp("{;role}", "g"), player.role.getDeathName())

	if (game.config.game["last-wills"].allow) {
		let will = "We could not find a last will."

		const defined_will = player.getWill()

		if (defined_will) {
			will = "We found a will next to their body:\n```fix\n" + defined_will + "```"
		}

		message = message.replace(new RegExp("{;will_message}", "g"), will)
	} else {
		message = message.replace(new RegExp("{;will_message}", "g"), "")
	}

	// Remove trailing
	// eslint-disable-next-line no-control-regex
	message = message.replace(new RegExp("[\n]*$", "g"), "")

	return message
}
