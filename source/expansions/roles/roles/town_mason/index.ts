import cryptographicShuffle from "../../../../auxils/cryptographicShuffle"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import createMasonChannels from "./createMasonChannels"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Mason.

Role Abilities:
- You are given a common night chat with the other masons.

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export default class TownMason implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = []

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		const game = player.getGame()
		if (player.misc.paired) {
			return
		}

		// Form as many pairs as possible before forming triplets
		const available = cryptographicShuffle(
			game.findAllPlayers(
				(x) =>
					x.role.identifier === "town_mason" &&
					x.isAlive() &&
					x.identifier !== player.identifier &&
					!x.misc.paired
			)
		)

		if (available.length < 1) {
			throw new Error("Unpairable number of masons!")
		}

		player.misc.mason_initiator = true

		let group: Player[]
		if (available.length === 2) {
			group = [player].concat(available.splice(0, 2))
		} else {
			group = [player].concat(available.splice(0, 1))
		}

		for (let i = 0; i < group.length; i++) {
			group[i].misc.paired = true
		}
		await createMasonChannels(game, group)
	}

	async onRoutines(player: Player): Promise<void> {
		const game = player.getGame()
		const config = game.config

		// Stop initiation
		if (!game.playerExists((x) => x.misc.mason_channel === player.misc.mason_channel && x.isAlive())) {
			return
		}

		const channel = game.getChannelById(player.misc.mason_channel)
		if (!channel) {
			throw new Error(`No mason channel found`)
		}

		if (player.misc.mason_initiator === true) {
			await channel.send(
				"~~                                              ~~    **" + game.getFormattedDay() + "**"
			)
		}

		const member = player.getGuildMember()

		if (!member) {
			return
		}

		if (game.isDay()) {
			// Day time
			await channel.createOverwrite(member, config["base-perms"].read)
		} else {
			// Night time
			await channel.createOverwrite(member, config["base-perms"].post)
		}
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: true,
		ALLOW_NIGHT: true,
		ALLOW_DEAD: false,
	}
}
