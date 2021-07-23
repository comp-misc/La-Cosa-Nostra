import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"

export default class Citizen extends BasicRolePart<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	readonly properties: PartialRoleProperties = {
		investigation: "Vanilla",
	}

	constructor() {
		super(null, null)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Citizen"
	}
}
