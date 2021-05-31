import TownVigilante from ".."
import createTargetCommand, { TargetRoleCommand } from "../../../../../commands/createTargetCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const cmd: TargetRoleCommand = async (game, message, target, from) => {
	const actions = game.actions
	actions.delete((x) => x.from === from.identifier && x.identifier === "town_vigilante/kill")

	if (target === "nobody") {
		from.misc.vigUsed = false
		await message.reply(":dagger: You have decided not to kill anyone tonight")
		return
	}

	from.misc.vigUsed = true
	await game.addAction("town_vigilante/kill", ["cycle"], {
		name: "Vigilante-kill",
		expiry: 1,
		from,
		to: target,
		priority: ActionPriorities.KILL,
	})

	await message.reply(":dagger: You have decided to kill **" + target.getDisplayName() + "** tonight.")
}

cmd.PRIVATE_ONLY = true
cmd.DEAD_CANNOT_USE = true
cmd.ALIVE_CANNOT_USE = false
cmd.DISALLOW_DAY = false
cmd.DISALLOW_NIGHT = false

export default createTargetCommand(cmd, {
	name: "kill",
	description: "Select a player to kill",
	preValidation: async (_game, message, _params, player) => {
		const role = player.role.role as TownVigilante
		if (role.isOutOfShots(player)) {
			await message.reply(":x: You are out of shots!")
			return false
		}
		if (!role.canUseKill(player)) {
			await message.reply(":x: You can't use your kill command right now!")
			return false
		}
		return true
	},
})
