import auxils from "../../systems/auxils"
import { GameCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const alive: GameCommand = async (game, message) => {
	const roles = game.players

	let players_alive = 0
	let display_message = ""

	for (const item of roles) {
		if (item.status.alive) {
			players_alive++
			display_message = display_message + item.getDisplayName() + ", "
		}
	}

	if (players_alive < 1) {
		await message.channel.send("There are __0__ players alive!")
	} else {
		let grammar: string
		if (players_alive == 1) {
			grammar = "is"
		} else {
			grammar = "are"
		}

		const aliveStr = `There ${grammar} __${players_alive}__ player${auxils.vocab("s", players_alive)} alive:`
		await message.channel.send(
			aliveStr + "\n```" + display_message.substring(0, display_message.length - 2) + "```"
		)
	}
}

alive.ALLOW_PREGAME = false
alive.ALLOW_GAME = true
alive.ALLOW_POSTGAME = false

export default makeCommand(alive, {
	name: "alive",
	description: "Shows who is left alive",
})
