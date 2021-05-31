import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import BaseMafiaConfig from "../BaseMafiaConfig"
import investigateCmd from "./commands/investigate"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name} You are a Mafia Role Cop.

Role Abilities:
- You may each night choose to check what role a player has. You will receive the report next morning.

Factional Abilities:
- You are given a common mafia night chat with the other mafias.
- You may each night use the mafia factional kill on a player.

Win Condition: You win when mafia gains majority and all other threats are eliminated.`

export default class MafiaRoleCop implements ProgrammableRole<BaseMafiaConfig> {
	readonly config: BaseMafiaConfig
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [investigateCmd]

	constructor(config: BaseMafiaConfig) {
		this.config = config
	}

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.addAttribute("mafia_factionkill")

		await player.getGame().addAction("mafia_role_cop/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	async onRoutines(player: Player): Promise<void> {
		const config = player.getGame().config

		// Nighttime actions
		const channel = player.getPrivateChannel()

		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":mag_right: You may investigate a player tonight.\n\n" + investigateCmd.formatUsageDescription(config)
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DEAD: false,
		ALLOW_DAY: false,
		ALLOW_NIGHT: true,
	}
}
