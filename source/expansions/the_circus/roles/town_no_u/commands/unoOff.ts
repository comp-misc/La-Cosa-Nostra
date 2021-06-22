import { RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"

const nouOff: RoleCommand = async (game, message, _params, player) => {
	const deleted = game.actions.delete(
		(action) => action.from === player.identifier && action.identifier === "town_no_u/nou_init"
	)
	if (deleted.length > 0) {
		await message.reply(":white_check_mark: You are no longer deploying your reverse uno card")
	} else {
		await message.reply(":x: You never had your card deployed to begin with")
	}
}

nouOff.PRIVATE_ONLY = true
nouOff.ALIVE_CANNOT_USE = false
nouOff.DEAD_CANNOT_USE = true
nouOff.DISALLOW_DAY = true
nouOff.DISALLOW_NIGHT = false

export default makeCommand(nouOff, {
	name: "uno-off",
	description: "Puts your reverse uno card back in your pocket",
})
