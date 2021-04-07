import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"

const attackedExport = async <T>(actionable: Actionable<T>, game: Game, params: ExecutionParams): Promise<void> => {
	const attacked = game.getPlayerByIdentifier(actionable.from)
	if (!attacked) {
		throw new Error(`No player found with identifier '${actionable.from}'`)
	}

	const strength = params.strength

	const defense = Math.max(attacked.getRoleStats()["basic-defense"], attacked.getPermanentStats()["basic-defense"])
	const temp_defense = attacked.getTemporaryStats()["basic-defense"]

	const cond1 = strength <= defense
	const cond2 = defense >= temp_defense

	if (cond1 && cond2) {
		const day = game.isDay()

		if (!day) {
			game.addMessage(attacked, ":exclamation: You were " + attackedExport.NIGHT_MESSAGE + "!")
		} else {
			if (attackedExport.INSTANT_FOR_DAY) {
				await attacked.getPrivateChannel().send(":exclamation: You were " + attackedExport.DAY_MESSAGE + "!")
			} else {
				game.addMessage(attacked, ":exclamation: You were " + attackedExport.DAY_MESSAGE + "!")
			}
		}
	}
}

attackedExport.DAY_MESSAGE = "attacked"
attackedExport.NIGHT_MESSAGE = "attacked last night"

attackedExport.INSTANT_FOR_DAY = true

export = attackedExport
