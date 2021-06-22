import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import BaseMafiaConfig from "../../../roles/roles/BaseMafiaConfig"
import roleProperties from "./role.json"
import bribeCmd from "./commands/bribe"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Mafia Lobbyist.

While most players have sound ethics, there are others who may change their alignment for selfish gain.
In this setup, there exists one player who is Town aligned, but can be converted to Mafia with bribes.

Bribed players will be added to Mafia chat and be able to perform night kills

Abilities:
- Factional Communication: Each night phase, you may communicate with your group.
- Factional Kill: Each night phase, you may send a member of your group to target another player in the game, attempting to kill them.
- Bribe: Each night phase, you may attempt to bribe a player to join the Mafia.

Win condition:
- You win when the Mafia obtain a majority with all threats eliminated.
`.trim()

export default class MafiaLobbyist implements ProgrammableRole<BaseMafiaConfig> {
	readonly config: BaseMafiaConfig
	readonly commands: CommandProperties<RoleCommand>[] = [bribeCmd]
	readonly properties: RoleProperties = roleProperties

	constructor(config: BaseMafiaConfig) {
		this.config = config
	}

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.addAttribute("mafia_factionkill")
		await player.getGame().addAction("mafia_lobbyist/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	async onRoutines(player: Player): Promise<void> {
		const channel = player.getPrivateChannel()

		const message = this.config.allowMultipleActions ? "" : "instead of using the factional kill"
		await player
			.getGame()
			.sendPeriodPin(
				channel,
				":moneybag: You may bribe a player tonight" +
					message +
					".\n\n" +
					bribeCmd.formatUsageDescription(player.getGame().config)
			)
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DEAD: false,
		ALLOW_NIGHT: true,
		ALLOW_DAY: false,
	}
}
