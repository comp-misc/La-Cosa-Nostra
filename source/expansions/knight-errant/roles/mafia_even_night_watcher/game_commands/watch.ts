import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const watch: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions
	// Run checks, etc

	actions.delete(
		(x) =>
			x.from === from.identifier &&
			(x.tags.includes("mafia_factional_side") || x.tags.includes("mafia_factional_main"))
	)

	if (target === "nobody") {
		await message.reply(":mag: You have decided not to watch anyone tonight.")
		await game
			.getChannel("mafia")
			.send(":telescope: **" + from.getDisplayName() + "** is not watching anyone tonight.")
		return
	}

	await game.addAction("mafia_even_night_watcher/watch", ["cycle"], {
		name: "Watcher-watch",
		expiry: 1,
		from,
		to: target,
		tags: ["mafia_factional_side"],
	})

	const mention = target.getDisplayName()

	await message.reply(":telescope: You have decided to watch **" + mention + "** tonight.")
	await game
		.getChannel("mafia")
		.send(":telescope: **" + from.getDisplayName() + "** is watching **" + mention + "** tonight.")
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
			await message.reply(":x: You may only track on even nights")
			return false
		}
		return true
	},
	name: "watch",
	description: "Allows you to watch a player for visitations",
})
