import auxils from "../../../systems/auxils"
import { WinCondition } from "../../../systems/win_conditions"

const town: WinCondition = async (game) => {
	const winners = game.findAll((x) => x.getRoleOrThrow().alignment === "town" && x.canWin())

	await game.setWins(winners)
	await game.getMainChannel().send(auxils.getAssetAttachment("town-wins.png"))
	game.primeWinLog("town", "All threats to the Town have been wiped out.")

	return true
}

town.STOP_GAME = true
town.STOP_CHECKS = false

town.FACTIONAL = true

town.PRIORITY = 3
town.CHECK_ONLY_WHEN_GAME_ENDS = false

// Accepts function
// Should key in wrt to player
town.ELIMINATED = [
	"mafia",
	"neutral-killing",
	"revolutionary",
	"reactionary",
	"alien",
	"plaguebearer",
	"pestilence",
	"epi_plaguebearer",
	"epi_pestilence",
	"cult",
	"serial_killer",
	"arsonist",
]
town.SURVIVING = ["town"]

town.PREVENT_CHECK_ON_WIN = []

town.DESCRIPTION = "Eliminate all threats to the Town."

export = town
