import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import deleteMafiaAction from "../../../../roles/roles/deleteMafiaAction"

const bribe: TargetRoleCommand = async (game, message, target, from) => {
	deleteMafiaAction(from, "mafia_lobbyist/bribe", true)

	if (target === "nobody") {
		await message.reply(":moneybag: You have decided not to bribe anyone tonight")
		await game
			.getChannel("mafia")
			.send(":moneybag: **" + from.getDisplayName() + "** is not bribing anyone tonight.")
		return
	}

	await game.addAction("mafia_lobbyist/bribe", ["cycle"], {
		name: "Mafia-Lobbyist-bribe",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.DEFAULT,
	})
	await message.reply(`:moneybag: You have now selected to bribe **${target.getDisplayName()}** tonight.`)
	await game
		.getChannel("mafia")
		.send(`:moneybag: **${from.getDisplayName()}** is bribing **${target.getDisplayName()}** tonight.`)
}

bribe.PRIVATE_ONLY = true
bribe.DEAD_CANNOT_USE = true
bribe.ALIVE_CANNOT_USE = false
bribe.DISALLOW_DAY = true
bribe.DISALLOW_NIGHT = false

export default createTargetCommand(bribe, {
	name: "bribe",
	description: "Bribe a corrupt player in an attempt to convert them to Mafia",
})
