import capitaliseFirstLetter from "../../../../../auxils/capitaliseFirstLetter"
import { RoleActionable } from "../../../../../systems/actionables"

const gather: RoleActionable = (actionable, game) => {
	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	const visit_log = game.actions.visit_log
	const actions = visit_log
		.filter(
			(entry) =>
				entry.target === actionable.to &&
				entry.type &&
				!(entry.visitor === actionable.from && entry.type === "watch")
		)
		.map(({ type }) => type as string)
	if (actions.length === 0) {
		game.addMessage(from, `:telescope:  No actions were performed on **${target.getDisplayName()}** last night.`)
	} else {
		const actionsStr = actions.map((action) => "*" + capitaliseFirstLetter(action) + "*").join(", ")
		game.addMessage(
			from,
			`:telescope: The following actions were performed on **${target.getDisplayName()}**: ${actionsStr}`
		)
	}
}

export default gather
