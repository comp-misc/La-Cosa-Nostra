import auxils from "../../systems/auxils"
import { AdminCommand } from "../CommandType"

const primeestimate: AdminCommand = async (message, params, config) => {
	const timezone = config.time.timezone

	const current = new Date()

	const now = new Date()

	current.setUTCHours(-timezone, 0, 0, 0)

	while (current.getTime() - now.getTime() < 0) {
		current.setUTCHours(current.getUTCHours() + 24)
	}

	const next_action = new Date(current)

	const display_timezone = timezone >= 0 ? `+${timezone}` : timezone

	const delta = current.getTime() - new Date().getTime()

	await message.channel.send(
		`:ok: If the game is initialised now (UTC**${display_timezone}**), the game will start at **${auxils.formatUTCDate(
			next_action
		)}**, or in **${auxils.formatDate(delta)}**.`
	)
}

export default primeestimate
