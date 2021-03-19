import { WinCondition } from "../../../systems/win_conditions"

const jack_of_all_trades: WinCondition = (game) => {
	const jack_of_all_trades = game.findAll(
		(x) => x.role_identifier === "jack_of_all_trades" && x.misc.joat_actions_left < 1 && !x.hasWon()
	)

	if (jack_of_all_trades.length > 0) {
		const winners = jack_of_all_trades.filter((x) => x.canWin())

		// Revolutionaries win
		game.setWins(winners)
		return true
	}

	return false
}

jack_of_all_trades.STOP_GAME = false
jack_of_all_trades.STOP_CHECKS = false

jack_of_all_trades.FACTIONAL = false

jack_of_all_trades.PRIORITY = 1
jack_of_all_trades.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
jack_of_all_trades.ELIMINATED = []
jack_of_all_trades.SURVIVING = []

jack_of_all_trades.PREVENT_CHECK_ON_WIN = []

jack_of_all_trades.DESCRIPTION = "Fulfil the conditions of four random night actions."

export = jack_of_all_trades
