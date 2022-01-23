import { RoleActionable } from "../../../../../systems/actionables"

const mirror: RoleActionable = (action, game) => {
	const actions = game.actions.findAll((action) => action.to === action.from && action.from !== action.from)
	for (const action of actions) {
		action.to = action.from
	}
}

mirror.TAGS = ["roleblockable"]

export default mirror
