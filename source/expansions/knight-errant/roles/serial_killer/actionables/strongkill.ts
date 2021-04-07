import { RoleActionable } from "../../../../../systems/actionables"
import unstoppableAttack from "../../../../../rolesystem/prototypes/unstoppableAttack"

const strongkill: RoleActionable = async (actionable, game, params) => {
	await unstoppableAttack(actionable, game, params)

	const killer = game.getPlayerOrThrow(actionable.from)

	killer.misc.strongkills_left--
}

strongkill.TAGS = ["visit"]

export default strongkill
