import getAssetAttachment from "../../../auxils/getAssetAttachment"
import { WinCondition } from "../../../systems/win_conditions"
import MafiaTeam1 from "../roles/mafia_team_1"
import MafiaTeam2 from "../roles/mafia_team_2"

const mafiaTeam2: WinCondition = async (game) => {
	const alive = game.getAlivePlayers()
	const mafia_team_2 = alive.filter((x) => x.role.hasPart(MafiaTeam2))

	const someAlive = alive.length > 0
	const team1Eliminated = !alive.some((x) => x.role.hasPart(MafiaTeam1))
	const p0Eliminated = !alive.some((x) => x.role.hasPart(PatientZero))
	const team1Majority = mafia_team_2.length >= alive.length / 2

	if (someAlive && team1Eliminated && p0Eliminated && team1Majority) {
		// Parity reached

		const winners = game.findAllPlayers((x) => x.role.hasPart(MafiaTeam1) && x.canWin())

		await game.setWins(winners)
		await game.getMainChannel().send(getAssetAttachment("mafia-team-2-wins.png"))
		game.primeWinLog("mafia team 2", "Mafia Team 2 has successfully eliminated all threats to itself.")

		return true
	}
	return false
}

mafiaTeam2.id = "mafia_team_2"
mafiaTeam2.STOP_GAME = true
mafiaTeam2.STOP_CHECKS = false

mafiaTeam2.PRIORITY = 3
mafiaTeam2.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
mafiaTeam2.ELIMINATED = []
mafiaTeam2.SURVIVING = []

mafiaTeam2.PREVENT_CHECK_ON_WIN = []

mafiaTeam2.DESCRIPTION = "Eliminate Mafia Team 1 and Patient Zero, and gain majority"

export default mafiaTeam2
