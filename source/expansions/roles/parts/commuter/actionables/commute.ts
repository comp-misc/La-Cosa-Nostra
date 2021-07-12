import Commuter from ".."
import basicCommute from "../../../../../rolesystem/prototypes/basicCommute"
import { RoleActionable } from "../../../../../systems/actionables"

const commute: RoleActionable = async (actionable, game, params) => {
	basicCommute.reason = "commute"
	await basicCommute(actionable, game, params)

	const player = game.getPlayerOrThrow(actionable.from)
	const role = player.role.getPartOrThrow(Commuter)
	role.state.shotsTaken++
}

commute.TAGS = ["visit"]

export default commute
