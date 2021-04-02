import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const kill: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions

	// Run checks, etc
	actions.delete(
		(x) =>
			(x.from === from.identifier && x.tags.includes("mafia_factional_side")) ||
			x.tags.includes("mafia_factional_main")
	)

	if (target === "nobody") {
		await message.reply(":dagger: You have decided not to use the factional kill.")
		await game
			.getChannel("mafia")
			.send(
				":dagger: **" +
					from.getDisplayName() +
					"** has decided not to kill anyone tonight. No kill will be attempted if no further action is submitted."
			)
		return
	}

	game.addAction("a/mafia_factionkill/kill", ["cycle"], {
		name: "Factionkill-kill",
		expiry: 1,
		priority: 6,
		from,
		to: target,
		tags: ["mafia_factional_main"],
	})

	await message.reply(
		":dagger: You have decided to use the factional kill on **" + target.getDisplayName() + "** tonight."
	)
	await game
		.getChannel("mafia")
		.send(
			":dagger: **" +
				from.getDisplayName() +
				"** is using the factional kill on **" +
				target.getDisplayName() +
				"** tonight."
		)
}

kill.ALLOW_NONSPECIFIC = false
kill.PRIVATE_ONLY = true
kill.DEAD_CANNOT_USE = true
kill.ALIVE_CANNOT_USE = false
kill.DISALLOW_DAY = true
kill.DISALLOW_NIGHT = false

export default createTargetCommand(kill, {
	name: "kill",
	description: "Select a player to faction night kill",
})
