import { RoleActionable } from "../../../../../systems/actionables"

const nou: RoleActionable = (nouAction, game) => {
	const killActions = game.actions.findAll(
		(action) => action.identifier.endsWith("/kill") && action.to === nouAction.to
	)
	for (const action of killActions) {
		action.to = action.from
		action.from = nouAction.from
	}
}

nou.TAGS = ["roleblockable"]

export default nou
