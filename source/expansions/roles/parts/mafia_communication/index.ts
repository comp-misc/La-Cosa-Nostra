import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { PartialRoleProperties } from "../../../../role"
import FactionCommunication from "../faction_communication"
import { CommunicationConfig } from "../group_channel"

/**
 * Default Mafia Factional Communication with:
 *  - Night only
 *  - "mafia" chat channel name
 */
export default class MafiaCommunication extends FactionCommunication<CommunicationConfig> {
	override readonly commands: CommandProperties<RoleCommand>[] = []
	override readonly properties: PartialRoleProperties = {}
	constructor() {
		super({
			channelName: "mafia",
			phase: "night",
		})
	}
}
