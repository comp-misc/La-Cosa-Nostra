import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const invite: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions
	actions.delete((x) => x.from === from.identifier && x.identifier === "town_socialiser/invite")

	if (target === "nobody") {
		await message.reply(":tada: You have decided not to invite anyone tonight")
		return
	}

	if (target.special_channels.some((ch) => ch.name === "party")) {
		await message.reply(":x: That player is already in the party")
		return
	}

	await game.addAction("town_socialiser/invite", ["cycle"], {
		name: "Town-Socialiser-Invite",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.DEFAULT,
	})
	await message.reply(`:tada: You have decided to invite **${target.getDisplayName()}** tonight.`)
}

invite.PRIVATE_ONLY = true
invite.DEAD_CANNOT_USE = true
invite.ALIVE_CANNOT_USE = false
invite.DISALLOW_DAY = true
invite.DISALLOW_NIGHT = false

export default createTargetCommand(invite, {
	name: "invite",
	description: "Select a player to invite to your party",
})
