import { WinCondition } from "../../../../systems/win_conditions"
import MafiaFaction from "../../parts/mafia_faction"
import mafiaTeam1WinCon from "../../role_win_conditions/mafia_team_1"

export default class MafiaTeam1 extends MafiaFaction {
	readonly winCondition: WinCondition = mafiaTeam1WinCon

	constructor() {
		super({ faction: 1 })
	}
}
