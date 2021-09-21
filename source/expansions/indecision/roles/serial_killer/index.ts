import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import {
	BasicCompleteRole,
	CompleteRoleProperties,
	MergedRole,
	RoleDescriptor,
	RoutineProperties,
} from "../../../../role"
import Bulletproof from "../../../roles/parts/bulletproof"
import RegularKill from "../../../roles/parts/regular_kill"
import serialKillerWinCondition from "../../../roles/role_win_conditions/serial_killer"
import AlignmentDisguise from "../../../roles/parts/alignment_disguise"

export default class SerialKiller extends BasicCompleteRole<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []
	readonly winCondition = serialKillerWinCondition
	readonly properties: CompleteRoleProperties = {
		alignment: {
			id: "3p",
			representation: null,
		},
	}

	constructor() {
		super(null, null)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Serial Killer"
	}

	override async onRoleStart(role: MergedRole): Promise<void> {
		await role.addPart(new RegularKill({ singleAction: true }))
		await role.addPart(new AlignmentDisguise({ alignmentInvestigation: "Town" }))
		await role.addPart(new Bulletproof())
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
	}
}
