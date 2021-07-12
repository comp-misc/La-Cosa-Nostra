import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"

export default class GodFather extends BasicRolePart<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	constructor() {
		super(null, null)
	}

	readonly properties: PartialRoleProperties = {
		alignmentInvestigation: "Town",
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Godfather"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "Investigation Immune",
			description: "You will appear as innocent to any alignment checks.",
		})
	}
}
