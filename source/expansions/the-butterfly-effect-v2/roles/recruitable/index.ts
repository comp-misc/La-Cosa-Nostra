import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicCompleteRole, CompleteRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import { WinCondition } from "../../../../systems/win_conditions"
import recruitableWinCon from "../../role_win_conditions/recruitable"

export default class Recruitable extends BasicCompleteRole<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []
	readonly properties: CompleteRoleProperties = {
		alignment: {
			id: "recruitable",
		},
	}
	readonly winCondition: WinCondition = recruitableWinCon
	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.addDescription(RoleDescriptor.CATEGORY.PASSIVE_ABILITIES, {
			name: "Recruitable",
			description:
				"You may be recruited to one of the existing mafia teams, in which case your win condition will be changed to win with your mafia team",
		})
		descriptor.additionalInformation.push("You are limited to at most one action each night.")
	}
}
