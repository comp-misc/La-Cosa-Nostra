import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game, { KillCircumstances } from "../../systems/game_templates/Game"
import AttackPrototype from "./AttackPrototype"

const basicAttack: AttackPrototype = async <T>(
	actionable: Actionable<T>,
	game: Game,
	_params?: ExecutionParams,
	astral = false,
	broadcast_offset = 0
) => {
	const attacked = game.getPlayerOrThrow(actionable.to)

	const attack_parameters: KillCircumstances = {
		target: actionable.target || actionable.to,
		attacker: actionable.from,
		priority: actionable.priority,
		strength: 1,
	}

	await game.execute("attacked", attack_parameters)

	if (!astral) {
		await game.execute("visit", {
			visitor: actionable.from,
			target: actionable.to,
			priority: actionable.priority,
			reason: basicAttack.reason,
			secondary_reason: basicAttack.secondary_reason,
			type: "kill",
		})
	}

	const stat = attacked.getStat("basic-defense", Math.max)

	if (stat < 1) {
		// Kill the player
		attack_parameters.type = "attack"
		await game.kill(attacked, basicAttack.reason, basicAttack.secondary_reason, broadcast_offset, attack_parameters)
		return true
	} else {
		return false
	}
}

basicAttack.reason = "killed"
basicAttack.secondary_reason = undefined

export default basicAttack
