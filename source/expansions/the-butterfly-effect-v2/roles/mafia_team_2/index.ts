import { WinCondition } from "../../../../systems/win_conditions"
import MafiaFaction from "../../parts/mafia_faction"
import mafiaTeam2WinCon from "../../role_win_conditions/mafia_team_2"

export default class MafiaTeam2 extends MafiaFaction {
	readonly winCondition: WinCondition = mafiaTeam2WinCon

	constructor() {
		super({ faction: 2 })
	}
}
