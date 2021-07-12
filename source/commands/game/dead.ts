import auxils from "../../systems/auxils"
import Player from "../../systems/game_templates/Player"
import { GameCommand } from "../CommandType"

const returnDayNight = (number: number): string => {
	if (
		(Math.round((number % 2) * 10) / 10) % 2 == 1 ||
		(Math.round((number % 2) * 10) / 10) % 2 == 1.1 ||
		(Math.round((number % 2) * 100) / 100) % 2 == 1.05
	) {
		return `N${(Math.floor(number) + 1) / 2}`
	} else {
		return `D${Math.floor(number) / 2}`
	}
}

const dead: GameCommand = async (game, message) => {
	const roles = game.players

	let players_dead = 0
	let display_message = ""

	const information_list: [number, Player][] = []

	//liste.push([a,b])

	const deadPlayers = roles.filter((role) => !role.status.alive)

	for (const role of deadPlayers) {
		players_dead++

		if (role.time_of_death == undefined) {
			role.time_of_death = game.getPeriod()
			information_list.push([game.getPeriod(), role])
		} else {
			//if already defined -> either because, 1) defined here before or 2) defined in .../executable_misc/getDeathMessage.js

			information_list.push([role.time_of_death, role])
		}
	}

	if (players_dead < 1) {
		await message.channel.send("There are __0__ dead players.")
	} else {
		let grammar: string
		if (players_dead == 1) {
			grammar = "is"
		} else {
			grammar = "are"
		}

		const sorted_list = information_list.sort((a, b) => a[0] - b[0])

		for (let i = 0; i < sorted_list.length; i++) {
			display_message =
				display_message +
				returnDayNight(information_list[i][0]) +
				": " +
				sorted_list[i][1].getDisplayName() +
				" - " +
				sorted_list[i][1].role.getDeathName() +
				"\n"
		}

		const deadPlayersStr = `There ${grammar} __${players_dead}__ dead player${auxils.vocab("s", players_dead)}:`
		await message.channel.send(deadPlayersStr + "\n```" + display_message + "```")
	}
}

dead.ALLOW_PREGAME = false
dead.ALLOW_GAME = true
dead.ALLOW_POSTGAME = false

export default dead
