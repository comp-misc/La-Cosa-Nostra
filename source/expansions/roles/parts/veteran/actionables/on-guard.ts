import { RoleActionable } from "../../../../../systems/actionables"
import unstoppableAttack from "../../../../../rolesystem/prototypes/unstoppableAttack"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const onGuard: RoleActionable = async (actionable, game) => {
	const from = game.getPlayerOrThrow(actionable.from)

	const actions = game.actions.findAll((action) => action.to === from.identifier && action.from !== from.identifier)
	for (const action of actions) {
		await unstoppableAttack(
			{
				identifier: "veteran/kill-visitor",
				from: from.identifier,
				target: action.from,
				to: action.from,
				expiry: 1,
				priority: ActionPriorities.KILL,
				tags: [],
				execution: 0,
				triggers: [],
				cycles: 0,
			},
			game
		)
	}
}

export default onGuard
