import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicCompleteRole, CompleteRoleProperties, RoutineProperties } from "../../../../role"
import mafiaWinCon from "../../role_win_conditions/mafia"

export default class Mafia extends BasicCompleteRole<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	readonly winCondition = mafiaWinCon
	readonly properties: CompleteRoleProperties = {
		alignment: {
			id: "mafia",
		},
	}

	routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	constructor() {
		super(null, null)
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	formatDescriptor(): void {}
}
