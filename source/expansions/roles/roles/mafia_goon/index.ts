/* eslint-disable @typescript-eslint/no-empty-function */
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Mafia Goon.

Abilities:
- Factional Communication: Each night phase, you may communicate with your group.
- Factional Kill: Each night phase, you may send a member of your group to target another player in the game, attempting to kill them.

Win condition:
- You win when the Mafia obtain a majority with all threats eliminated.
`.trim()

export default class MafiaGoon implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = []

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.addAttribute("mafia_factionkill")
	}

	onRoutines(): void {}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}
}
