import { WinCondition } from "../../../systems/win_conditions"
import Jester from "../roles/3p_jester"

const jester: WinCondition = async (game) => {
	const wonJesters = game
		.getAllPeriodLogEntries()
		.flatMap((entry) => entry.death_broadcasts)
		.filter(
			(broadcast) =>
				broadcast.reason === "__lynched__" &&
				game.getPlayerOrThrow(broadcast.playerId).role.role instanceof Jester
		)
		.map((broadcast) => game.getPlayerOrThrow(broadcast.playerId))
	for (const jester of wonJesters) {
		if (!jester.hasWon()) {
			await game.setWin(jester)
		}
	}
	return wonJesters.length > 0
}

jester.STOP_GAME = false
jester.STOP_CHECKS = false

jester.PRIORITY = 1
jester.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
jester.ELIMINATED = []
jester.SURVIVING = []

jester.PREVENT_CHECK_ON_WIN = []

jester.DESCRIPTION = "Get lynched."

export default jester
