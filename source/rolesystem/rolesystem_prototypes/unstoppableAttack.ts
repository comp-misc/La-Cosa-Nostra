import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"
import AttackPrototype from "./AttackPrototype"

const unstoppableAttack: AttackPrototype = <T>(
	actionable: Actionable<T>,
	game: Game,
	_params?: ExecutionParams,
	astral = false,
	broadcast_offset = 0
): boolean => {
	const attacked = game.getPlayerByIdentifierOrThrow(actionable.to)

	const attack_parameters: Record<string, any> = {
		attacker: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		strength: 3,
		astral: astral,
		reason: unstoppableAttack.reason,
		secondary_reason: unstoppableAttack.secondary_reason,
	}

	game.execute("attacked", attack_parameters)

	if (!astral) {
		game.execute("visit", {
			visitor: actionable.from,
			target: actionable.to,
			priority: actionable.priority,
			reason: unstoppableAttack.reason,
			secondary_reason: unstoppableAttack.secondary_reason,
		})
	}

	const stat = attacked.getStat("basic-defense", Math.max)

	if (stat < 3) {
		// Kill the player
		attack_parameters.type = "attack"
		game.kill(
			attacked,
			unstoppableAttack.reason,
			unstoppableAttack.secondary_reason,
			broadcast_offset,
			attack_parameters
		)
		return true
	} else {
		return false
	}
}

unstoppableAttack.reason = "killed"
unstoppableAttack.secondary_reason = undefined

export = unstoppableAttack
