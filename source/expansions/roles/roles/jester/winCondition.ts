import Jester from "."
import { WinCondition } from "../../../../systems/win_conditions"

const jester: WinCondition = async (game) => {
	const wonJesters = game
		.getAllPeriodLogEntries()
		.flatMap((entry) => entry.death_broadcasts)
		.filter(
			(broadcast) =>
				broadcast.reason === "__lynched__" && game.getPlayerOrThrow(broadcast.playerId).role.hasPart(Jester)
		)
		.map((broadcast) => game.getPlayerOrThrow(broadcast.playerId))
	for (const jester of wonJesters) {
		if (!jester.hasWon()) {
			await game.setWin(jester)
		}
	}
	return wonJesters.length > 0
}

jester.id = "jester"
jester.STOP_GAME = false
jester.STOP_CHECKS = false

jester.PRIORITY = 1
jester.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
jester.ELIMINATED = []
jester.SURVIVING = []

jester.PREVENT_CHECK_ON_WIN = []

jester.DESCRIPTION = "You win if you are successfully lynched during the day."

export default jester
