import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"

export default class Bomb extends BasicRolePart<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	constructor() {
		super(null, null)
	}

	readonly properties: PartialRoleProperties = {
		investigation: "Bomb",
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("bomb/onKilled", ["killed"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Bomb"
		descriptor.addDescription(RoleDescriptor.CATEGORY.PASSIVE_ABILITIES, {
			name: "Bomb",
			description:
				"If night killed, your bomb will explode, killing all players who successfully executed a kill action on you that night",
		})
	}
}
