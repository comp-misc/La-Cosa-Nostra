import basicAttack from "../../../../../rolesystem/prototypes/basicAttack"
import { RoleActionable } from "../../../../../systems/actionables"

const shoot: RoleActionable = async (actionable, game, params) => {
	const oldReason = basicAttack.reason
	const oldSecondaryReason = basicAttack.secondary_reason
	basicAttack.reason = "__shot__"
	basicAttack.secondary_reason = "shot"
	await basicAttack(actionable, game, params)
	basicAttack.reason = oldReason
	basicAttack.secondary_reason = oldSecondaryReason
}

export default shoot
