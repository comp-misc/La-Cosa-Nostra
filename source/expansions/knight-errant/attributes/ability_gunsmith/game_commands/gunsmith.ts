import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import clearModuleActions from "../../../../../rolesystem/modular/clearModuleActions"

const gunsmith: TargetRoleCommand = async (game, message, target, from) => {
	clearModuleActions(game, from.identifier, "ability")

	if (target === "nobody") {
		await message.reply(":mag: You have decided not to gunsmith investigate anyone tonight.")
		return
	}
	game.addAction("a/ability_gunsmith/investigate", ["cycle"], {
		name: "Modular-gunsmith-investigate",
		expiry: 1,
		from,
		to: target,
		meta: { type: "ability" },
		priority: 4,
	})

	await message.reply(":mag: You have decided to gunsmith investigate **" + target.getDisplayName() + "** tonight.")
}

gunsmith.ALLOW_NONSPECIFIC = false
gunsmith.PRIVATE_ONLY = true
gunsmith.DEAD_CANNOT_USE = true
gunsmith.ALIVE_CANNOT_USE = false
gunsmith.DISALLOW_DAY = true
gunsmith.DISALLOW_NIGHT = false

export default createTargetCommand(gunsmith, {
	name: "gunsmith",
	description: "Selects a player to gunsmith investigate",
})
