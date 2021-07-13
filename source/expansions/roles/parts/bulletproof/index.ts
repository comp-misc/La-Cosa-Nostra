import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import Player from "../../../../systems/game_templates/Player"

export default class Bulletproof extends BasicRolePart<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	constructor() {
		super(null, null)
	}

	readonly properties: PartialRoleProperties = {
		investigation: "Bulletproof",
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	override async onStart(player: Player): Promise<void> {
		//TODO Move to a role part?
		await player.addAttribute("protection", Infinity, { amount: 1 })
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Bulletproof"
		descriptor.addDescription(RoleDescriptor.CATEGORY.PASSIVE_ABILITIES, {
			name: "Protection 1",
			description:
				"You will survive one attempted night kill. This ability will be used instantly, and you will not be alerted.",
		})
	}
}
