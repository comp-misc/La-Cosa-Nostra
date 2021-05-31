import auxils from "../../systems/auxils"
import { GameCommand } from "../CommandType"

const preempt: GameCommand = async (game, message, params) => {
	const config = game.config

	if (!config.game["allow-pre-emptive-votes"]) {
		await message.channel.send(":x:  Pre-emptive votes are disabled in this game.")
		return
	}

	const player = game.getPlayerById(message.author.id)
	if (!player) {
		await message.channel.send(":x:  You are not in the game")
		return
	}

	if (!player.isAlive()) {
		await message.channel.send(":x:  You cannot pre-empt votes when you are dead!")
		return
	}

	// Check private channel
	if (player.channel?.id !== message.channel.id) {
		await message.channel.send(":x:  You cannot use that command here!")
		return
	}

	// Allows players to pre-empt their votes before the day
	if (game.isDay()) {
		await message.channel.send(":x:  You may only pre-empt votes during nighttime!")
		return
	}

	if (params.length < 1) {
		await message.channel.send(
			":x:  Wrong syntax! Use `" +
				config["command-prefix"] +
				'preempt <alphabet/name/"clear"/"list"> [alphabet/name]...` instead!'
		)
		return
	}

	// Pre-empt votes

	if (params[0].toLowerCase() === "list") {
		const votes = player.getPreemtiveVotes()
		const names = []

		if (votes.length < 1) {
			await message.channel.send(
				":open_file_folder:  No pre-emptive votes set.\n\nUse `" +
					config["command-prefix"] +
					"preempt <alphabet/name> [alphabet/name]...` to set it!"
			)
			return
		}

		for (let i = 0; i < votes.length; i++) {
			names.push(`${i + 1}. ${game.getPlayerByIdentifier(votes[i])?.getDisplayName() || "???"}`)
		}

		await message.channel.send(
			":open_file_folder:  Current pre-emptive votes:\n```fix\n" +
				names.join("\n") +
				"```\n\nUse `" +
				config["command-prefix"] +
				"preempt <alphabet/name> [alphabet/name]...` to change it!"
		)

		return
	}

	player.clearPreemptiveVotes()

	if (params[0].toLowerCase() === "clear") {
		await message.channel.send(":file_folder:  Successfully cleared all pre-emptive votes.")
		return
	}

	const fails: string[] = []
	const passed_names: string[] = []
	const passed_identifiers: string[] = []

	for (let i = 0; i < params.length; i++) {
		const current = game.getPlayerMatch(params[i])

		if (current.score < 0.7 || !current.player.isAlive()) {
			fails.push("`" + params[i] + "`")
			continue
		}

		if (passed_identifiers.includes(current.player.identifier)) {
			continue
		}

		// Add to identifier pre-emptive array
		passed_identifiers.push(current.player.identifier)
		passed_names.push(`${i - fails.length + 1}. ${current.player.getDisplayName()}`)
	}

	if (fails.length > 0) {
		// Print failed message
		await message.channel.send(
			":x:  I cannot not recognise the player" +
				auxils.vocab("s", fails.length) +
				" " +
				auxils.pettyFormat(fails) +
				"."
		)
		return
	}

	if (passed_identifiers.length > 0) {
		// Format names

		for (let i = 0; i < passed_identifiers.length; i++) {
			player.addPreemptiveVote(passed_identifiers[i])
		}

		await message.channel.send(
			":file_folder:  Set the following pre-emptive votes:\n```fix\n" +
				passed_names.join("\n") +
				"```\n**Notice**: these votes will be executed and cleared immediately once the trial starts."
		)
	}
}

preempt.ALLOW_PREGAME = false
preempt.ALLOW_GAME = true
preempt.ALLOW_POSTGAME = false

export default preempt
