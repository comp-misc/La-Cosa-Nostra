import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"
import AttackPrototype from "./AttackPrototype"

const powerfulAttack: AttackPrototype = async <T>(
	actionable: Actionable<T>,
	game: Game,
	_params?: ExecutionParams,
	astral = false,
	broadcast_offset = 0
): Promise<boolean> => {
	const attacked = game.getPlayerOrThrow(actionable.to)

	const attack_parameters: ExecutionParams = {
		attacker: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		strength: 2,
		astral: astral,
		reason: powerfulAttack.reason,
		secondary_reason: powerfulAttack.secondary_reason,
	}

	await game.execute("attacked", attack_parameters)

	if (!astral) {
		await game.execute("visit", {
			visitor: actionable.from,
			target: actionable.to,
			priority: actionable.priority,
			reason: powerfulAttack.reason,
			type: "strong kill",
			secondary_reason: powerfulAttack.secondary_reason,
		})
	}

	const stat = attacked.getStat("basic-defense", Math.max)

	if (stat < 2) {
		// Kill the player
		attack_parameters.type = "attack"
		await game.kill(
			attacked,
			powerfulAttack.reason,
			powerfulAttack.secondary_reason,
			broadcast_offset,
			attack_parameters
		)
		return true
	} else {
		return false
	}
}

powerfulAttack.reason = "killed"
powerfulAttack.secondary_reason = undefined

export default powerfulAttack
