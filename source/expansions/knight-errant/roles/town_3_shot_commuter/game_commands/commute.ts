import { RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"

const commute: RoleCommand = async (game, message, params, from) => {
	const config = game.config

	if (from.misc.commutes_left < 1) {
		await message.reply(":x: No commutes left")
		return
	}

	const already_commuting = game.actions.exists(
		(x) => x.from === from.identifier && x.identifier === "town_3_shot_commuter/commute"
	)

	if (already_commuting) {
		await message.reply(
			":x: You have already decided to commute tonight! Use `" +
				config["command-prefix"] +
				"deselect` to choose not to commute tonight."
		)
		return
	}

	from.misc.already_not_commuting = false

	await message.reply(":camping: You have decided to commute tonight.")

	await game.addAction("town_3_shot_commuter/commute", ["cycle"], {
		name: "Commuter-commute",
		expiry: 1,
		from,
		to: from,
	})
}

commute.ALLOW_NONSPECIFIC = false
commute.PRIVATE_ONLY = true
commute.DEAD_CANNOT_USE = true
commute.ALIVE_CANNOT_USE = false
commute.DISALLOW_DAY = true
commute.DISALLOW_NIGHT = false

export default makeCommand(commute, {
	name: "commute",
	description: "Allows you to commute this night. Use '!deselect' to not commute",
})
