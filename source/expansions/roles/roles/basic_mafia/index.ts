import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicCompleteRole, CompleteRoleProperties, MergedRole, RoutineProperties } from "../../../../role"
import MafiaCommunication from "../../parts/mafia_communication"
import MafiaFactionKill from "../../parts/mafia_faction_kill"
import { ExclusiveActionConfig } from "../../parts/RemovableAction"
import mafiaWinCon from "../../role_win_conditions/mafia"

export default class BasicMafia extends BasicCompleteRole<ExclusiveActionConfig, null> {
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

	constructor(config: ExclusiveActionConfig) {
		super(config, null)
	}

	override async onRoleStart(role: MergedRole): Promise<void> {
		await role.addPart(new MafiaCommunication())
		await role.addPart(new MafiaFactionKill(this.config))
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	formatDescriptor(): void {}
}
