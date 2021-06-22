import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const insure: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions
	actions.delete((x) => x.from === from.identifier && x.identifier === "town_insurance_broker/insure")

	if (target === "nobody") {
		await message.reply(":ticket: You have decided not to get an insurance quote for anyone tonight")
		return
	}

	await game.addAction("town_insurance_broker/insure", ["cycle"], {
		name: "Town-Insurance-Broker-insure",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.DEFAULT,
	})
	await message.reply(
		`:ticket: You have decided to get an insurance quote for **${target.getDisplayName()}** tonight.`
	)
}

insure.PRIVATE_ONLY = true
insure.DEAD_CANNOT_USE = true
insure.ALIVE_CANNOT_USE = false
insure.DISALLOW_DAY = true
insure.DISALLOW_NIGHT = false

export default createTargetCommand(insure, {
	name: "insure",
	description: "Get an insurance quote for a player",
	usage: "insure <player>",
})
