import auxils from "../../systems/auxils"
import { GameCommand } from "../CommandType"

const alive: GameCommand = (game, message) => {
	const roles = game.players

	let players_alive = 0
	let display_message = ""

	for (let i = 0; i < roles.length; i++) {
		if (roles[i].status.alive) {
			players_alive++
			display_message = display_message + roles[i].getDisplayName() + ", "
		}
	}

	if (players_alive < 1) {
		message.channel.send("There are __0__ players alive!")
	} else {
		let grammar: string
		if (players_alive == 1) {
			grammar = "is"
		} else {
			grammar = "are"
		}
		message.channel.send(
			"There " +
				grammar +
				" __" +
				players_alive +
				"__ player" +
				auxils.vocab("s", players_alive) +
				" alive:\n```" +
				display_message.substring(0, display_message.length - 2) +
				"```"
		)
	}
}

alive.ALLOW_PREGAME = false
alive.ALLOW_GAME = true
alive.ALLOW_POSTGAME = false

export = alive
