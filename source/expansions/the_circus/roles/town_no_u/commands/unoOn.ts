import TownNoU from ".."
import { RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"
import ActionPriorities from "../../../../../systems/game_templates/ActionPriorities"

const nouOn: RoleCommand = async (game, message, _params, player) => {
	const role = player.role.role as TownNoU
	if (role.getUses() >= role.config.maximumUses) {
		await message.reply(":x: You are out of uses!")
		return
	}

	game.actions.delete((action) => action.from === player.identifier && action.identifier === "town_no_u/nou_init")
	await game.addAction("town_no_u/nou_init", ["cycle"], {
		name: "Town-No-u-nou",
		expiry: 1,
		from: player,
		to: player,
		priority: ActionPriorities.HIGH,
	})

	await message.reply(":white_check_mark: You are now deploying your reverse uno card!")
}

nouOn.PRIVATE_ONLY = true
nouOn.ALIVE_CANNOT_USE = false
nouOn.DEAD_CANNOT_USE = true
nouOn.DISALLOW_DAY = true
nouOn.DISALLOW_NIGHT = false

export default makeCommand(nouOn, {
	name: "uno-on",
	description: "Deploys your reverse uno card",
})
