import Recruiter from ".."
import { RoleActionable } from "../../../../../systems/actionables"
import Recruitable from "../../../roles/recruitable"
import MafiaTeam1 from "../../../roles/mafia_team_1"
import MafiaTeam2 from "../../../roles/mafia_team_2"

const recruit: RoleActionable = async (actionable, game) => {
	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)

	const recruiter = from.role.getPartOrThrow(Recruiter)

	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Recruiter-recruit-attempt",
		type: "recruit",
	})

	if (!target.role.hasPart(Recruitable)) {
		game.addMessage(from, ":exclamation: The recruit failed.")
		await from.broadcastTargetMessage(":exclamation: The recruit failed.")
		return
	}

	const team = recruiter.config.team
	const newRole = team === 1 ? new MafiaTeam1() : new MafiaTeam2()
	await target.role.changeMainRole(newRole)

	game.addMessage(target, `:exclamation: You have been recruited to Mafia Team ${team}!`)
	await from.broadcastTargetMessage(
		`:exclamation: **${target.getDisplayName()}** has been recruited to the mafia team!`
	)
}

recruit.TAGS = ["drivable", "roleblockable", "visit"]

export default recruit
