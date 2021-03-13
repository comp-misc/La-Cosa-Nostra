import lcn from "../../../../../source/lcn"
import { RoleActionable } from "../../../../../source/systems/actionables"
import { Actionable } from "../../../../../source/systems/game_templates/Actions"

const rs = lcn.rolesystem

const attacked: RoleActionable = (actionable, game, params) => {
	const attacker = game.getPlayerByIdentifierOrThrow(params?.attacker)
	const attacked = game.getPlayerByIdentifierOrThrow(actionable.from)

	const visit_log = game.actions.visit_log

	for (let i = 0; i < visit_log.length; i++) {
		if (visit_log[i].target === attacked.id) {
			rs.prototypes.basicAttack({ from: attacked.id, to: attacker.id } as Actionable<unknown>, game, params)
		}
	}
}

export = attacked
