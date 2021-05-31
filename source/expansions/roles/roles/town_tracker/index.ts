import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"
import trackCmd from "./commands/track"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Tracker.

Role Abilities:
- You may each night choose to track a player to see who they visited, if anyone. You will receive the report next morning.

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export default class TownTracker implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [trackCmd]

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("town_tracker/roleblock_noresult", ["roleblock"], {
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
				":mag: You may choose to track a player tonight.\n\n" + trackCmd.formatUsageDescription(config)
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
		ALLOW_DAY: false,
	}
}
