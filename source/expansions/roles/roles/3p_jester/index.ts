/* eslint-disable @typescript-eslint/no-empty-function */
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Jester.

Role Abilities:
- You have no abilities.

Win Condition: You can win if you are successfully lynched during the day.
`.trim()

export default class Jester implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = []

	getDescription(): string {
		return DESCRIPTION
	}

	onStart(): void {}

	onRoutines(): void {}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}
}
