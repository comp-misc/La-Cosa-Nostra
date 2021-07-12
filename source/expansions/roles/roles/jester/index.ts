import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicCompleteRole, CompleteRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import { WinCondition } from "../../../../systems/win_conditions"
import jesterWinCon from "./winCondition"

export default class Jester extends BasicCompleteRole<null, null> {
	readonly winCondition: WinCondition = jesterWinCon
	readonly commands: CommandProperties<RoleCommand>[] = []

	properties: CompleteRoleProperties = {
		investigation: "Jester",
		alignment: {
			id: "3p",
			representation: null,
		},
	}
	routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	constructor() {
		super(null, null)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Jester"
	}
}
