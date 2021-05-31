import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import ConsecutiveTargetConfig, {
	consecutiveTargetRoutines,
	formatConsecutiveRoleDescription,
} from "../ConsecutiveTargetConfig"
import jailCmd from "./commands/jail"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Jailkeeper.

Role Abilities:
- Each night, you may choose to jail a player. This results in both a protection and roleblock for your target\${cooldownDescription}

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export default class TownJailkeeper implements ProgrammableRole<ConsecutiveTargetConfig> {
	readonly config: ConsecutiveTargetConfig
	readonly commands: CommandProperties<RoleCommand>[]
	readonly properties: RoleProperties = roleProperties

	constructor(config: ConsecutiveTargetConfig) {
		this.config = config
		this.commands = [jailCmd]
	}

	getDescription(): string {
		return formatConsecutiveRoleDescription(DESCRIPTION, this.config)
	}

	onStart(player: Player): void {
		player.misc.jailTargets = []
	}

	async onRoutines(player: Player): Promise<void> {
		const channel = player.getPrivateChannel()

		consecutiveTargetRoutines(player, "jailTargets")
		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":european_castle: You may jail a player tonight.\n\n" +
					jailCmd.formatUsageDescription(player.getGame().config)
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
		ALLOW_DAY: false,
	}
}
