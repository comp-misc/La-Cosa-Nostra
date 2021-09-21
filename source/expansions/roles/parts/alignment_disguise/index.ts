import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"

export interface Config {
	alignmentInvestigation: string
}

export default class AlignmentDisguise extends BasicRolePart<Config, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []
	readonly properties: PartialRoleProperties = {
		alignmentInvestigation: this.config.alignmentInvestigation,
	}
	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	constructor(config: Config) {
		super(config, null)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.addDescription(RoleDescriptor.CATEGORY.PASSIVE_ABILITIES, {
			name: "Alignment Investigation Disguise",
			description: `You will appear as ${this.config.alignmentInvestigation} to Alignment Cops`,
		})
	}
}
