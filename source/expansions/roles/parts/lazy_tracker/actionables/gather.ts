import { RoleActionable } from "../../../../../systems/actionables"

const gather: RoleActionable = (actionable, game) => {
	const lazyTracker = game.getPlayerOrThrow(actionable.from)

	for (const visit of game.actions.visit_log) {
		if (visit.visitor === actionable.to && visit.target) {
			game.addMessage(lazyTracker, `:mag_right: You target visited at least one player last night`)
			return
		}
	}

	game.addMessage(lazyTracker, ":mag_right: Your target did not visit anybody last night.")
}

export default gather
