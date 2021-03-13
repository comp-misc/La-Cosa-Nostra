import { getTimer, hasTimer } from "../../../getTimer"
import auxils from "../../../systems/auxils"
import { AdminCommand } from "../../CommandType"

const integritycheck: AdminCommand = async (message) => {
	if (!hasTimer()) {
		await message.channel.send(":x: No savable instance to check.")
		return null
	}
	const timer = getTimer()

	const game = timer.game

	const tampers: Record<string, any> = {}
	let total_tampers = 0

	if (game.tampered_load_times && game.tampered_load_times.length > 0) {
		tampers["Main save"] = game.tampered_load_times
		total_tampers += game.tampered_load_times.length
	}

	for (let i = 0; i < game.players.length; i++) {
		const player = game.players[i]

		if (player.tampered_load_times && player.tampered_load_times.length > 0) {
			tampers[player.identifier + "'s save"] = player.tampered_load_times
			total_tampers += player.tampered_load_times.length
		}
	}

	if (total_tampers < 1) {
		await message.channel.send(
			":ok: The game saves have been tampered with **" +
				total_tampers +
				"** time" +
				auxils.vocab("s", total_tampers) +
				"."
		)
	} else {
		const tamper_log = []
		for (const key in tampers) {
			tamper_log.push(key + " - " + tampers[key].length)
		}

		await message.channel.send(
			":ok: The game saves have been tampered with **" +
				total_tampers +
				"** time" +
				auxils.vocab("s", total_tampers) +
				":\n```fix\n" +
				tamper_log.join("\n") +
				"```\nFor full details check the saves using `!_checksaves` as to when the tampered files were loaded."
		)
	}
}

export = integritycheck
