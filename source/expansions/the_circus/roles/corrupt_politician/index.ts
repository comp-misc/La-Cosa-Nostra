/* eslint-disable @typescript-eslint/no-empty-function */
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import BaseMafiaConfig from "../../../roles/roles/BaseMafiaConfig"
import roleProperties from "./role.json"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Corrupt Politician.

Life is tough you know? While you primarily work for your citizens, you can be bribed to join the Mafia.

At night, Mafia may attempt to bribe a player to join their organisation, however they are unaware which players are corrupt (including you!)

Role Abilities:
- As Town: You have the ability to be bribed and join the Mafia.
- As Mafia: 
   - Factional Communication: Each night phase, you may communicate with your group.
   - Factional Kill: Each night phase, you may send a member of your group to target another player in the game, attempting to kill them.

Win Condition: 
 - As Town:  You win when all threats to town have been eliminated and there is at least one member of town left.
 - As Mafia: You win when Mafia gains a majority and all other threats are eliminated.
`.trim()

export interface CorruptPoliticianConfig extends BaseMafiaConfig {
	isCorrupt?: boolean
}

export default class CorruptPolitician implements ProgrammableRole<CorruptPoliticianConfig> {
	readonly config: CorruptPoliticianConfig
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = []

	constructor(config: CorruptPoliticianConfig) {
		this.config = config
		if (this.config.isCorrupt) {
			this.properties.alignment = "mafia"
			this.properties["see-mafia-chat"] = true
		}
	}

	async bribe(player: Player): Promise<void> {
		const game = player.getGame()
		const member = player.getGuildMember()
		if (member) {
			const mafiaChannel = game.getChannel(game.channels.mafia.id)
			if (!mafiaChannel) {
				throw new Error("No mafia channel found")
			}
			const readPerms = game.config["base-perms"].read
			await mafiaChannel.createOverwrite(member, readPerms)
			player.addSpecialChannel(mafiaChannel)
		}

		this.properties.alignment = "mafia"
		this.properties["see-mafia-chat"] = true

		await player.addAttribute("mafia_factionkill")
		this.config.isCorrupt = true
		game.addMessage(player, ":moneybag: You have been bribed and will join the Mafia chat")
		player.see_mafia_chat = true
	}

	isCorrupt(): boolean {
		return this.config.isCorrupt === true
	}

	getDescription(): string {
		return DESCRIPTION
	}

	onStart(): void {
		this.config.isCorrupt = false
	}

	onRoutines(): void {}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}
}
