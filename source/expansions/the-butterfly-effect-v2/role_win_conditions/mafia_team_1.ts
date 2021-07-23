import getAssetAttachment from "../../../auxils/getAssetAttachment"
import { WinCondition } from "../../../systems/win_conditions"
import MafiaTeam1 from "../roles/mafia_team_1"
import MafiaTeam2 from "../roles/mafia_team_2"

const mafiaTeam1: WinCondition = async (game) => {
	const alive = game.getAlivePlayers()
	const mafia_team_1 = alive.filter((x) => x.role.hasPart(MafiaTeam1))

	const someAlive = alive.length > 0
	const team2Eliminated = !alive.some((x) => x.role.hasPart(MafiaTeam2))
	const p0Eliminated = !alive.some((x) => x.role.hasPart(PatientZero))
	const team1Majority = mafia_team_1.length >= alive.length / 2

	if (someAlive && team2Eliminated && p0Eliminated && team1Majority) {
		// Parity reached

		const winners = game.findAllPlayers((x) => x.role.hasPart(MafiaTeam1) && x.canWin())

		await game.setWins(winners)
		await game.getMainChannel().send(getAssetAttachment("mafia-team-1-wins.png"))
		game.primeWinLog("mafia team 1", "Mafia Team 1 has successfully eliminated all threats to itself.")

		return true
	}
	return false
}

mafiaTeam1.id = "mafia_team_1"
mafiaTeam1.STOP_GAME = true
mafiaTeam1.STOP_CHECKS = false

mafiaTeam1.PRIORITY = 3
mafiaTeam1.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
mafiaTeam1.ELIMINATED = []
mafiaTeam1.SURVIVING = []

mafiaTeam1.PREVENT_CHECK_ON_WIN = []

mafiaTeam1.DESCRIPTION = "Eliminate Mafia Team 2 and Patient Zero, and gain majority"

export default mafiaTeam1
