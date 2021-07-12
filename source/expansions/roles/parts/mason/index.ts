import { Snowflake } from "discord.js"
import cryptographicShuffle from "../../../../auxils/cryptographicShuffle"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import Player from "../../../../systems/game_templates/Player"
import createMasonChannels from "./createMasonChannels"

interface State {
	paired: boolean
	channelId?: Snowflake
}

export default class Mason extends BasicRolePart<null, State> {
	readonly properties: PartialRoleProperties = {
		investigation: "Mason",
	}
	readonly commands: CommandProperties<RoleCommand>[] = []

	constructor(_config?: null, state?: State) {
		super(null, state || { paired: false })
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Mason"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "Shared Chat",
			description: "You are given a common night chat with the other masons",
		})
	}

	override async onStart(player: Player): Promise<void> {
		const game = player.getGame()
		if (this.state.paired) {
			return
		}

		// Form as many pairs as possible before forming triplets
		const available = cryptographicShuffle(
			game.findAllPlayers((x) => {
				const role = x.role.getPart(Mason)
				return !!role && x.isAlive() && x.identifier !== player.identifier && !role.state.paired
			})
		)

		if (available.length < 1) {
			throw new Error("Unpairable number of masons!")
		}

		let group: Player[]
		if (available.length === 2) {
			group = [player, ...available.splice(0, 2)]
		} else {
			group = [player, ...available.splice(0, 1)]
		}
		for (const p of group) {
			p.role.getPartOrThrow(Mason).state.paired = true
		}
		await createMasonChannels(game, group)
	}

	override async onRoutines(player: Player): Promise<void> {
		const game = player.getGame()
		const config = game.config

		const { channelId } = this.state
		if (!channelId) {
			return
		}
		const channel = game.getChannelById(channelId)
		if (!channel) {
			return
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
