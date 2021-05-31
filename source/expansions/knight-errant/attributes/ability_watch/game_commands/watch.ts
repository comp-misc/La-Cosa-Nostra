import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import clearModuleActions from "../../../../../rolesystem/modular/clearModuleActions"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const watch: TargetRoleCommand = async (game, message, target, from) => {
	// Run checks, etc

	clearModuleActions(game, from.identifier, "ability")

	if (target === "nobody") {
		await message.reply(":mag: You have decided not to watch anyone tonight.")
		return
	}

	await game.addAction("a/ability_watch/watch", ["cycle"], {
		name: "Modular-watch",
		expiry: 1,
		from,
		to: target,
		meta: { type: "ability" },
		priority: ActionPriorities.INVESTIGATE,
	})

	await message.reply(":mag: You have decided to watch **" + target.getDisplayName() + "** tonight.")
}

watch.PRIVATE_ONLY = true
watch.DEAD_CANNOT_USE = true
watch.ALIVE_CANNOT_USE = false
watch.DISALLOW_DAY = true
watch.DISALLOW_NIGHT = false

export default createTargetCommand(watch, {
	name: "watch",
	description: "Select a player to watch",
})
