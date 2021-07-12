import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicCompleteRole, CompleteRoleProperties, RoutineProperties } from "../../../../role"
import townWinCon from "../../role_win_conditions/town"

export interface BaseMafiaConfig {
	allowMultipleActions: boolean
}

export default class Town extends BasicCompleteRole<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	readonly winCondition = townWinCon
	readonly properties: CompleteRoleProperties = {
		alignment: {
			id: "town",
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
