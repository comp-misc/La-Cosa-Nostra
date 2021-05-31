import basicCommute from "../../../../../rolesystem/prototypes/basicCommute"
import { RoleActionable } from "../../../../../systems/actionables"

const commute: RoleActionable = async (actionable, game, params) => {
	const target = game.getPlayerOrThrow(actionable.to)

	basicCommute.reason = "commute"
	await basicCommute(actionable, game, params)

	target.misc.commutes_left--
}

commute.TAGS = ["visit"]

export default commute
