import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import ConsecutiveTargetConfig, {
	consecutiveTargetRoutines,
	formatConsecutiveRoleDescription,
} from "../ConsecutiveTargetConfig"
import protectCmd from "./commands/protect"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Doctor.

Role Abilities:
- Each night, you may choose to protect a player from a single night kill, curing any poison they may have\${cooldownDescription}

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export default class TownDoctor implements ProgrammableRole<ConsecutiveTargetConfig> {
	readonly config: ConsecutiveTargetConfig
	readonly commands: CommandProperties<RoleCommand>[]
	readonly properties: RoleProperties = roleProperties

	constructor(config: ConsecutiveTargetConfig) {
		this.config = config
		this.commands = [protectCmd]
	}

	getDescription(): string {
		return formatConsecutiveRoleDescription(DESCRIPTION, this.config)
	}

	onStart(player: Player): void {
		player.misc.protectTargets = []
	}

	async onRoutines(player: Player): Promise<void> {
		const channel = player.getPrivateChannel()

		consecutiveTargetRoutines(player, "protectTargets")
		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":shield: You may protect a player tonight.\n\n" +
					protectCmd.formatUsageDescription(player.getGame().config)
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
		ALLOW_DAY: false,
	}
}
