import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { PartialRoleProperties, RoleDescriptor } from "../../../../role"
import GroupChannel, { CommunicationConfig } from "../group_channel"

export default class Neighbour extends GroupChannel<CommunicationConfig> {
	readonly commands: CommandProperties<RoleCommand>[] = []
	readonly properties: PartialRoleProperties = {
		investigation: "Neighbour",
	}

	constructor(config: CommunicationConfig) {
		super(config)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Neighbour"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "Communication",
			description: `Each ${this.config.phase} phase, the ${this.config.channelName} channel will be unlocked for conversation`,
		})
	}
}
