import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"

export default class VanillaTownie extends BasicRolePart<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	constructor() {
		super(null, null)
	}

	readonly properties: PartialRoleProperties = {
		investigation: "Vanilla",
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Vanilla Townie"
	}
}
