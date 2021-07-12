import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { PartialRoleProperties } from "../../../../role"
import GroupChannel, { CommunicationConfig } from "../../../roles/parts/group_channel"

export default class PartyMember extends GroupChannel<CommunicationConfig> {
	commands: CommandProperties<RoleCommand>[] = []
	properties: PartialRoleProperties = {}

	constructor() {
		super({
			channelName: "party",
			phase: "night",
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	formatDescriptor(): void {}
}
