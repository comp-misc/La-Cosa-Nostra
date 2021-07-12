import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"

export default class Goon extends BasicRolePart<null, null> {
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
		descriptor.name = "Goon"
	}
}
