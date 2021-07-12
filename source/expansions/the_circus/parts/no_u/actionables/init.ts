import NoU from ".."
import { RoleActionable } from "../../../../../systems/actionables"

const nouInit: RoleActionable = async (actionable, game) => {
	const role = game.getPlayerOrThrow(actionable.from).role.getPartOrThrow(NoU)
	role.onUse()

	await game.addAction("no_u/nou", ["cycle"], {
		name: "no u",
		expiry: 1,
		from: game.getPlayerOrThrow(actionable.from),
		to: game.getPlayerOrThrow(actionable.from),
		priority: 30,
	})
}

export default nouInit
