import TownSocialiser from ".."
import { RoleActionable } from "../../../../../systems/actionables"
import VanillaTownie from "../../../../roles/roles/town_vanilla_townie"

const invite: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Town-Socialiser-invite",
		type: "invite",
	})

	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	const socialiserRole = from.role.role as TownSocialiser

	const targetRole = target.role.role
	if (targetRole instanceof VanillaTownie) {
		await game.addMessage(from, `:tada: **${target.getDisplayName()}** accepted your party invite!`)
		await socialiserRole.addPlayerToParty(target)
	} else if (target.role.properties.alignment === "mafia") {
		//Want to allow an investigator to see the visited mafia as a suspect
		await game.kill(from, "__kill__", "killed", undefined, {
			attacker: target.identifier,
		})
	} else {
		await game.addMessage(
			from,
			`**${target.getDisplayName()}** unfortunately did not accept your party invite :cry:`
		)
	}
}

export default invite
