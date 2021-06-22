/* eslint-disable @typescript-eslint/no-empty-function */
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Mafia Escapee.

After being sent to prison for your crimes, you escape after breaking out of your cell. 
You count as a Mafia member, but the Mafia are unaware of your presence. Upon game start, you will be notified who the Mafia are.
You are not permitted to make night kills.

Abilities:
- You have no abilities

Win condition:
- You win when the Mafia obtain a majority with all threats eliminated.
`.trim()

export default class MafiaEscapee implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = []

	getDescription(): string {
		return DESCRIPTION
	}

	onStart(): void {}

	async postAdditionalRoleInformation(player: Player): Promise<void> {
		const mafia = player
			.getGame()
			.findAllPlayers((p) => p.role.properties.alignment === "mafia" && p.identifier !== player.identifier)
			.map((p) => p.getDisplayName())

		await player.getGame().sendPin(player.getPrivateChannel(), `**The mafia are: ${mafia.join(", ")}**`)
	}

	onRoutines(): void {}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}
}
