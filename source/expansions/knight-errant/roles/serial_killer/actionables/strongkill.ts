import { RoleActionable } from "../../../../../systems/actionables"
import unstoppableAttack from "../../../../../rolesystem/prototypes/unstoppableAttack"

const strongkill: RoleActionable = (actionable, game, params) => {
	unstoppableAttack(actionable, game, params)

	const killer = game.getPlayerOrThrow(actionable.from)

	killer.misc.strongkills_left--
}

strongkill.TAGS = ["visit"]

export default strongkill
