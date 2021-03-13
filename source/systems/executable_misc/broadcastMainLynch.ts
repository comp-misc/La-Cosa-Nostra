// Broadcast the lynch to the main channel
import Game from "../game_templates/Game"
import Player from "../game_templates/Player"
import auxils from "./../auxils"

export = async function (game: Game, roles: Player[]): Promise<void> {
	const config = game.config
	const channel = game.getMainChannel()

	if (roles.length === 0) {
		// Nobody lynched
		await channel.send(config.messages["abstain-lynch"])
		return
	}

	const lynched = auxils.pettyFormat(
		roles.map((role) => {
			role.misc.time_of_death = game.getPeriod() + 0.2
			return "**" + role.getDisplayName() + "**"
		})
	)
	if (roles.length === 1) {
		// Singular lynch
		const message = config.messages["singular-lynch"]

		await channel.send(message.replace(new RegExp("{;player}", "g"), lynched))
	} else {
		const message = config.messages["plural-lynch"]
		await channel.send(message.replace(new RegExp("{;players}", "g"), lynched))
	}
}
