import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import watchCmd from "./commands/watch"
import roleProperties from "./role.json"

const DESCRIPTION = `Role Description:
"Welcome to \${game.name}! You are a Town Voyeur.

Role Abilities:
- You may each night choose to watch a player to see what actions were performed on them. You will receive the report next morning.

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left."
` as const

export default class TownVoyeur implements ProgrammableRole<null> {
	config = null
	properties: RoleProperties = roleProperties
	commands: CommandProperties<RoleCommand>[] = [watchCmd]

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("town_voyeur/roleblock_noresult", ["roleblock"], {
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
				":telescope:  You may choose to watch a player tonight.\n\n" + watchCmd.formatUsageDescription(config)
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
	}
}
