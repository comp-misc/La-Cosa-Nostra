import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"

const jail: TargetRoleCommand = async (game, message, target, from) => {
	game.actions.delete((x) => x.from === from.identifier && x.identifier === "town_jailkeeper/jail")

	if (target === "nobody") {
		await message.reply(":european_castle: You have decided not to jail anyone tonight.")
		return
	}

	game.addAction("town_jailkeeper/jail", ["cycle"], {
		name: "Jailkeeper-jail",
		expiry: 1,
		from,
		to: target,
	})

	await message.reply(":european_castle: You have decided to jail **" + target.getDisplayName() + "** tonight.")
}

jail.ALLOW_NONSPECIFIC = false
jail.PRIVATE_ONLY = true
jail.DEAD_CANNOT_USE = true
jail.ALIVE_CANNOT_USE = false
jail.DISALLOW_DAY = true
jail.DISALLOW_NIGHT = false

export default createTargetCommand(jail, {
	name: "jail",
	description: "Selects a player to jail, preventing their night actions",
})
