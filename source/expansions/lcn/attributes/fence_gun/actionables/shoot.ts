import rs from "../../../../../rolesystem/rolesystem"
import { RoleActionable } from "../../../../../systems/actionables"

const shoot: RoleActionable = (actionable, game, params) => {
	const shooter = game.getPlayerByIdentifierOrThrow(actionable.from)
	const target = game.getPlayerByIdentifierOrThrow(actionable.to)

	const private_channel = shooter.getPrivateChannel()
	const target_channel = target.getPrivateChannel()
	const main_channel = game.getMainChannel()

	rs.prototypes.basicAttack.reason = "publicly shot by someone possessing a gun"

	const outcome = rs.prototypes.basicAttack(actionable, game, params)

	if (!outcome) {
		private_channel.send(":exclamation: Your target could not be shot!")
		target_channel.send(":exclamation: You were shot but you survived the attack!")
		main_channel.send(":gun: **" + shooter.getDisplayName() + "** shot, but nobody fell!")
	} else {
		private_channel.send(":exclamation: You shot your target!")
		target_channel.send(":exclamation: You were shot!")
		main_channel.send(
			":gun: **" +
				shooter.getDisplayName() +
				"** fired their gun, and the body of **" +
				target.getDisplayName() +
				"** falls on the ground."
		)
	}

	shooter.deleteAttribute((x) => x.identifier === "fence_gun")

	game.save()

	// Always return true for instant triggers to null the action
	return true
}

shoot.TAGS = ["visit", "day_action"]

export = shoot
