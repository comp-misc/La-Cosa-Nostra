import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import investigateCmd from "./commands/investigate"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Alignment Cop.

Role Abilities:
- You may each night choose to investigate a player and discover their alignment

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
` as const

export default class TownAlignmentCop implements ProgrammableRole<null> {
	config = null
	properties: RoleProperties = roleProperties
	commands: CommandProperties<RoleCommand>[] = [investigateCmd]

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("town_alignment_cop/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	async onRoutines(player: Player): Promise<void> {
		const config = player.getGame().config
		const channel = player.getPrivateChannel()
		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":mag_right: You may choose to investigate a player tonight.\n\n" +
					investigateCmd.formatUsageDescription(config)
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
	}
}
