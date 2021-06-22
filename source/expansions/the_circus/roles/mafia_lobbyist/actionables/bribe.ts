import { RoleActionable } from "../../../../../systems/actionables"
import CorruptPolitician from "../../corrupt_politician"

const bribe: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Lobbyist-bribe",
		type: "bribe",
	})

	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)
	const role = target.role.role
	if (!(role instanceof CorruptPolitician)) {
		game.addMessage(from, `:x: Your action failed as your target was not corruptible!`)
	} else {
		if (role.isCorrupt()) {
			game.addMessage(from, `:x: Your target is already corrupt!`)
		} else {
			await role.bribe(target)
			game.addMessage(
				from,
				`:white_check_mark: Your action was successful! **${target.getDisplayName()}** has been added to the Mafia chat`
			)
		}
	}
}

bribe.TAGS = ["drivable", "roleblockable", "visit"]

export default bribe
