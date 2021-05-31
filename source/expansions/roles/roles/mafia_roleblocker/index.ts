import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import BaseMafiaConfig from "../BaseMafiaConfig"
import ConsecutiveTargetConfig, {
	consecutiveTargetRoutines,
	formatConsecutiveRoleDescription,
} from "../ConsecutiveTargetConfig"
import roleblockCmd from "./commands/roleblock"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Mafia Roleblocker.

Abilities:
- Factional Communication: Each night phase, you may communicate with your group.
- Factional Kill: Each night phase, you may send a member of your group to target another player in the game, attempting to kill them.
- Roleblock: Each night phase, you may target another player to block them from performing any night actions\${cooldownDescription}. This action cannot be roleblocked.

Win condition:
- You win when the Mafia obtain a majority with all threats eliminated.
`.trim()

export interface RoleblockerConfig extends BaseMafiaConfig, ConsecutiveTargetConfig {
	/**
	 * The number of nights the role has to wait to be able to roleblock the same player again.
	 * 0 => No cooldown, can target the same player on consecutive nights
	 * 1 => Only can target the same player on non-consecutive nights
	 */
	sameTargetCooldown: number
}

export default class MafiaRoleblocker implements ProgrammableRole<RoleblockerConfig> {
	readonly config: RoleblockerConfig
	readonly commands: CommandProperties<RoleCommand>[]
	readonly properties: RoleProperties = roleProperties

	constructor(config: RoleblockerConfig) {
		this.config = config
		this.commands = [roleblockCmd]
	}

	getDescription(): string {
		return formatConsecutiveRoleDescription(DESCRIPTION, this.config)
	}

	async onStart(player: Player): Promise<void> {
		player.misc.roleblockTargets = []
		await player.addAttribute("mafia_factionkill")
	}

	async onRoutines(player: Player): Promise<void> {
		const channel = player.getPrivateChannel()

		const message = this.config.allowMultipleActions ? "" : "instead of using the factional kill"
		consecutiveTargetRoutines(player, "roleblockTargets")

		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":no_entry_sign: You may roleblock a player tonight" +
					message +
					".\n\n" +
					roleblockCmd.formatUsageDescription(player.getGame().config)
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
		ALLOW_DAY: false,
	}
}
