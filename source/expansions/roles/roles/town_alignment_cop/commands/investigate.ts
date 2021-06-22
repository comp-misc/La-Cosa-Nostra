import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const watch: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions
	actions.delete((x) => x.from === from.identifier && x.identifier === "town_alignment_cop/investigate")

	if (target === "nobody") {
		await message.reply(":mag_right: You have decided not to investigate anyone tonight")
		return
	}

	await game.addAction("town_alignment_cop/investigate", ["cycle"], {
		name: "Town-Alignment-Cop-Investigate",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	})
	await message.reply(`:mag_right: You have decided to investigate **${target.getDisplayName()}** tonight.`)
}

watch.PRIVATE_ONLY = true
watch.DEAD_CANNOT_USE = true
watch.ALIVE_CANNOT_USE = false
watch.DISALLOW_DAY = true
watch.DISALLOW_NIGHT = false

export default createTargetCommand(watch, {
	name: "investigate",
	description: "Select a investigate and determine their alignment",
})
