import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, MergedRole, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import Roleblocker from "../../../roles/parts/roleblocker"
import { TargetableRoleConfig } from "../../../roles/parts/targetableRolePart"
import Tracker from "../../../roles/parts/tracker"
import Vigilante from "../../../roles/parts/vigilante"

export default class JackOfAllTrades extends BasicRolePart<null, null> {
	readonly properties: PartialRoleProperties = {
		investigation: "Jack of All Trades",
	}
	readonly commands: CommandProperties<RoleCommand>[] = []

	constructor() {
		super(null, null)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Jack of All Trades"
		descriptor.additionalInformation.push("You may only use one action per night")
	}

	override async onRoleStart(role: MergedRole): Promise<void> {
		const joatTargetConfig: TargetableRoleConfig = {
			shots: {
				shots: 1,
				singularText: "shot",
				pluralText: "shots",
			},
			singleAction: true,
		}
		await role.addPart(new Vigilante(joatTargetConfig))
		await role.addPart(new Roleblocker(joatTargetConfig))
		await role.addPart(new Tracker(joatTargetConfig))
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
	}
}
