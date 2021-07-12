import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { PartialRoleProperties, RoleDescriptor } from "../../../../role"
import Player from "../../../../systems/game_templates/Player"
import GroupChannel, { CommunicationConfig } from "../group_channel"

export default class FactionCommunication<T extends CommunicationConfig> extends GroupChannel<T> {
	readonly commands: CommandProperties<RoleCommand>[] = []
	readonly properties: PartialRoleProperties = {}

	constructor(config: T) {
		super(config)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.addDescription(RoleDescriptor.CATEGORY.FACTIONAL_ABILITIES, {
			name: "Communication",
			description: "Each " + this.config.phase + " phase, you may communicate with your group",
		})
	}

	override async broadcastActionMessage(from: Player, message: string): Promise<void> {
		await this.getTextChannel(from.getGame()).send(message)
	}
}
