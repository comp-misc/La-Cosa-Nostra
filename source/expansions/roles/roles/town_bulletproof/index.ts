/* eslint-disable @typescript-eslint/no-empty-function */
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Bulletproof.

Role Abilities:
- You will survive one night kill. This ability will be used instantly, and you will not be alerted.

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export default class TownBulletproof implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = []

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.addAttribute("protection", Infinity, { amount: 1 })
	}

	onRoutines(): void {}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}
}
