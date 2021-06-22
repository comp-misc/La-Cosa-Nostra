/* eslint-disable @typescript-eslint/no-empty-function */
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Mafia Bulletproof.

Role Abilities:
- You will survive one night kill. This ability will be used instantly, and you will not be alerted.

Factional Abilities:
- You are given a common mafia night chat with the other mafias.
- You may each night use the mafia factional kill on a player.

Win Condition: You win when mafia gains majority and all other threats are eliminated.
`.trim()

export default class MafiaBulletproof implements ProgrammableRole<null> {
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
