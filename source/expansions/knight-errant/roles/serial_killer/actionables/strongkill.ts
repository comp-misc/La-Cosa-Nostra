import SerialKiller from ".."
import unstoppableAttack from "../../../../../rolesystem/prototypes/unstoppableAttack"
import { RoleActionable } from "../../../../../systems/actionables"

const strongkill: RoleActionable = async (actionable, game, params) => {
	await unstoppableAttack(actionable, game, params)

	const killer = game.getPlayerOrThrow(actionable.from)

	killer.role.getPartOrThrow(SerialKiller).state.strongkills_left--
}

strongkill.TAGS = ["visit"]

export default strongkill
