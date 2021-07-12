import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, CompleteRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import Player from "../../../../systems/game_templates/Player"

const flavourText = `
After being sent to prison for your crimes, you escape after breaking out of your cell. 
You count as a Mafia member, but the Mafia are unaware of your presence. Upon game start, you will be notified who the Mafia are.
You are not permitted to make night kills.
`

export default class Escapee extends BasicRolePart<null, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	readonly properties: CompleteRoleProperties = {
		alignment: {
			id: "mafia",
		},
		investigation: "Escapee",
	}

	routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	constructor() {
		super(null, null)
	}

	override async onStart(player: Player): Promise<void> {
		const mafia = player
			.getGame()
			.findAllPlayers((p) => p.role.properties.alignment.id === "mafia" && p.identifier !== player.identifier)
			.map((p) => p.getDisplayName())

		await player.getGame().sendPin(player.getPrivateChannel(), `**The mafia are: ${mafia.join(", ")}**`)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Escapee"
		descriptor.flavorText = flavourText.trim()
	}
}
