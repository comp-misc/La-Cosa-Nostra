import { Actionable, ExecutionParams } from "../../systems/game_templates/Actions"
import Game from "../../systems/game_templates/Game"
import AttackPrototype from "./AttackPrototype"

const basicAttack: AttackPrototype = <T>(
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
		strength: 1,
		astral: astral,
		reason: basicAttack.reason,
		secondary_reason: basicAttack.secondary_reason,
	}

	game.execute("attacked", attack_parameters)

	if (!astral) {
		game.execute("visit", {
			visitor: actionable.from,
			target: actionable.to,
			priority: actionable.priority,
			reason: basicAttack.reason,
			secondary_reason: basicAttack.secondary_reason,
		})
	}

	const stat = attacked.getStat("basic-defense", Math.max)

	if (stat < 1) {
		// Kill the player
		attack_parameters.type = "attack"
		game.kill(attacked, basicAttack.reason, basicAttack.secondary_reason, broadcast_offset, attack_parameters)
		return true
	} else {
		return false
	}
}

basicAttack.reason = "killed"
basicAttack.secondary_reason = undefined

export = basicAttack
