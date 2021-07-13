import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import {
	BasicCompleteRole,
	CompleteRoleProperties,
	MergedRole,
	RoleDescriptor,
	RoutineProperties,
} from "../../../../role"
import serialKillerWinCondition from "../../../roles/role_win_conditions/serial_killer"
import RegularKill from "../../../roles/parts/regular_kill"
import StrongKill from "../../../roles/parts/strong_kill"
import Bulletproof from "../../../roles/parts/bulletproof"

export default class SerialKiller extends BasicCompleteRole<null, null> {
	readonly properties: CompleteRoleProperties = {
		alignment: {
			id: "3p",
			representation: null,
		},
		investigation: "Vanilla",
	}
	readonly commands: CommandProperties<RoleCommand>[] = []
	readonly winCondition = serialKillerWinCondition

	constructor() {
		super(null, null)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Serial Killer"
		descriptor.addDescription(RoleDescriptor.CATEGORY.PASSIVE_ABILITIES, {
			name: "Investigation Immune",
			description: "You will appear Vanilla to Role Cops",
		})
		descriptor.additionalInformation.push("You may only use one action per night")
	}

	override async onRoleStart(role: MergedRole): Promise<void> {
		await role.addPart(new RegularKill({ singleAction: true }))
		await role.addPart(
			new StrongKill({
				singleAction: true,
				shots: 1,
			})
		)
		await role.addPart(new Bulletproof())
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
	}
}
