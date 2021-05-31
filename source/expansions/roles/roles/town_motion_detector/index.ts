import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"
import monitorCmd from "./commands/monitor"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Motion Detector.

Role Abilities:
- You may each night choose a player to see if any actions were performed by or on them, but not what or by who. You will receive the report the next morning.

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export default class TownMotionDetector implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [monitorCmd]

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("town_motion_detector/roleblock_noresult", ["roleblock"], {
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
				":mag_right:  You may choose to monitor a player tonight.\n\nUse `" +
					config["command-prefix"] +
					"monitor <player | nobody>` to select your target."
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
		ALLOW_DAY: false,
	}
}
