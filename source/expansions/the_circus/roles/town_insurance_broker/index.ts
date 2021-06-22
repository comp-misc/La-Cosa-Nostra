/* eslint-disable @typescript-eslint/no-empty-function */
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"
import insureCmd from "./commands/insure"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Insurance Broker

Role Abilities:
- Each night, you may produce a quote for the cost to insure a player
- Players with a higher risk to the town will cost more to insure

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export default class TownInsuranceBroker implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [insureCmd]

	getDescription(): string {
		return DESCRIPTION
	}

	onStart(): void {}

	async onRoutines(player: Player): Promise<void> {
		const config = player.getGame().config

		const channel = player.getPrivateChannel()
		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":ticket: You may produce a quote for a player tonight.\n\n" + insureCmd.formatUsageDescription(config)
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
	}
}
