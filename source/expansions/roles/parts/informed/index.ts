import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import choice from "../../../../auxils/choice"

export default class Informed extends BasicRolePart<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Informed"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "Role Information",
			description: "Learn the role of one random player at the start of the game",
		})
	}

	override async postAdditionalRoleInformation(player: Player): Promise<void> {
		const otherPlayers = player.getGame().players.filter((p) => p !== player)
		const randomPlayer = choice(otherPlayers)

		await player
			.getPrivateChannel()
			.send(`**${randomPlayer.getDisplayName()}**'s initial role is __${randomPlayer.role.getName()}__`)
	}

	readonly properties: PartialRoleProperties = {
		investigation: "Informed",
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_NIGHT: false,
		ALLOW_DEAD: false,
	}
}
