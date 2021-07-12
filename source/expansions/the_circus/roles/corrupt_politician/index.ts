import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicCompleteRole, CompleteRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import Game from "../../../../systems/game_templates/Game"
import Player from "../../../../systems/game_templates/Player"
import { WinCondition } from "../../../../systems/win_conditions"
import MafiaCommunication from "../../../roles/parts/mafia_communication"
import MafiaFactionKill from "../../../roles/parts/mafia_faction_kill"
import mafiaWinCon from "../../../roles/role_win_conditions/mafia"
import townWinCon from "../../../roles/role_win_conditions/town"

export interface State {
	isCorrupt: boolean
}

export default class CorruptPolitician extends BasicCompleteRole<null, State> {
	readonly commands: CommandProperties<RoleCommand>[] = []
	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	constructor(_config?: null, state?: State) {
		super(null, state || { isCorrupt: false })
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Corrupt Politician"
		descriptor.flavorText =
			"Life is tough you know? While you primarily work for your citizens, you can be bribed to join the Mafia.\n\n" +
			"At night, Mafia may attempt to bribe a player to join their organisation, however they are unaware which players are corrupt (including you!)"
		descriptor.addDescription("Role Abilities (as Town)", {
			name: "Bribeable",
			description: "You have the ability to be bribed and join the Mafia",
		})
		descriptor.addDescription(
			"Role Abilities (as Mafia)",
			{
				name: "Communication",
				description: "Each night phase, you may communicate with your group",
			},
			{
				name: "Kill",
				description:
					"Each night phase, you may send one member of your group to target another player in the game, attempting to kill them",
			}
		)
	}

	async bribe(player: Player): Promise<void> {
		if (this.state.isCorrupt) {
			return
		}
		await player.role.addPart(new MafiaCommunication())
		await player.role.addPart(new MafiaFactionKill({}))
		this.state.isCorrupt = true

		player.getGame().addMessage(player, ":moneybag: You have been bribed and will join the Mafia chat")
	}

	get properties(): CompleteRoleProperties {
		return {
			alignment: {
				id: this.state.isCorrupt ? "mafia" : "town",
			},
		}
	}

	get winCondition(): WinCondition {
		return this.duplicateWinCondition(this.state.isCorrupt ? mafiaWinCon : townWinCon)
	}

	isCorrupt(): boolean {
		return this.state.isCorrupt
	}

	private duplicateWinCondition(condition: WinCondition): WinCondition {
		const newCon = (game: Game) => condition(game)
		Object.assign(newCon, condition)
		newCon.DESCRIPTION = "As Town: " + townWinCon.DESCRIPTION + "\n - As Mafia: " + mafiaWinCon.DESCRIPTION
		return newCon as WinCondition
	}
}
