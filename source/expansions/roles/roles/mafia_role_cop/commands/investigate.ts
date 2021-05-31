import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"
import deleteMafiaAction from "../../deleteMafiaAction"

const investigate: TargetRoleCommand = async (game, message, target, from) => {
	deleteMafiaAction(from, "mafia_role_cop/investigate", true)

	if (target === "nobody") {
		await message.reply(":mag_right: You have decided not to investigate anyone tonight")
		await game
			.getChannel("mafia")
			.send(":mag_right: **" + from.getDisplayName() + "** is not investigate anyone tonight.")
		return
	}

	await game.addAction("mafia_role_cop/investigate", ["cycle"], {
		name: "Mafia-Rolecop-investigate",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.INVESTIGATE,
	})
	await message.reply(`:mag_right: You have now selected to investigate **${target.getDisplayName()}** tonight.`)
	await game
		.getChannel("mafia")
		.send(`:mag_right: **${from.getDisplayName()}** is investigating **${target.getDisplayName()}** tonight.`)
}

investigate.PRIVATE_ONLY = true
investigate.DEAD_CANNOT_USE = true
investigate.ALIVE_CANNOT_USE = false
investigate.DISALLOW_DAY = true
investigate.DISALLOW_NIGHT = false

export default createTargetCommand(investigate, {
	name: "investigate",
	description: "Investigate a player to learn their role",
})
