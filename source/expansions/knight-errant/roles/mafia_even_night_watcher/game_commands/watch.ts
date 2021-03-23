import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const watch: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions
	// Run checks, etc

	// if (game.getPeriod() % 4 !== 3) {
	// 	return null
	// }

	actions.delete(
		(x) =>
			x.from === from.identifier && (x.tags.includes("mafia_factional_side") || x.tags.includes("mafia_factional_main"))
	)

	if (target === "nobody") {
		await message.reply(":mag: You have decided not to watch anyone tonight.")
		await game
			.getChannel("mafia")
			.send(":exclamation: **" + from.getDisplayName() + "** is not watching anyone tonight.")
		return
	}

	game.addAction("mafia_even_night_watcher/watch", ["cycle"], {
		name: "Watcher-watch",
		expiry: 1,
		from,
		to: target,
		tags: ["mafia_factional_side"],
	})

	const mention = target.getDisplayName()

	await message.reply(":mag: You have decided to watch **" + mention + "** tonight.")
	await game
		.getChannel("mafia")
		.send(":exclamation: **" + from.getDisplayName() + "** is watching **" + mention + "** tonight.")
}

watch.ALLOW_NONSPECIFIC = false
watch.PRIVATE_ONLY = true
watch.DEAD_CANNOT_USE = true
watch.ALIVE_CANNOT_USE = false
watch.DISALLOW_DAY = true
watch.DISALLOW_NIGHT = false

export default createTargetCommand(watch, {
	preValidation: async (game, message) => {
		if (game.getPeriod() % 4 !== 3) {
			await message.reply(":x: You can't watch a player on this night")
			return false
		}
		return true
	},
	name: "watch",
	description: "Allows you to watch a player for visitations",
})
