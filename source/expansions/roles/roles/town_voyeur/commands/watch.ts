import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const watch: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions
	actions.delete((x) => x.from === from.identifier && x.identifier === "town_voyeur/watch")

	if (target === "nobody") {
		await message.reply(":telescope:  You have now selected to not watch anyone tonight.")
		return
	}

	await game.addAction("town_voyeur/watch", ["cycle"], {
		name: "Watcher-watch",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	})
	await message.reply(`:telescope:  You have now selected to watch **${target.getDisplayName()}** tonight.`)
}

watch.PRIVATE_ONLY = true
watch.DEAD_CANNOT_USE = true
watch.ALIVE_CANNOT_USE = false
watch.DISALLOW_DAY = true
watch.DISALLOW_NIGHT = false

export default createTargetCommand(watch, {
	name: "watch",
	description: "Select a player to watch and discover any visitors",
})
