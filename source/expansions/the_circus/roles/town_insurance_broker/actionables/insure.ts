import TownInsuranceBroker from ".."
import { RoleActionable } from "../../../../../systems/actionables"
import Jester from "../../../../roles/roles/3p_jester"
import MafiaRolecop from "../../../../roles/roles/mafia_role_cop"
import CorruptPolitician from "../../corrupt_politician"
import MafiaLobbyist from "../../mafia_lobbyist"
import MafiaGoon from "../../../../roles/roles/mafia_goon"
import Escapee from "../../mafia_escapee"
import CrimeSceneInvestigator from "../../town_crime_scene_investigator"
import Marksman from "../../town_marksman"
import TownBulletproof from "../../../../roles/roles/town_bulletproof"
import TownSocialiser from "../../town_socialiser"
import TownNoU from "../../town_no_u"
import VanillaTownie from "../../../../roles/roles/town_vanilla_townie"
import { ProgrammableRole } from "../../../../../systems/Role"

const getCost = (role: ProgrammableRole<unknown>): number => {
	if (role instanceof Jester) return 100
	else if (role instanceof MafiaLobbyist) return 150
	else if (role instanceof MafiaRolecop) return 150
	else if (role instanceof MafiaGoon) return 125
	else if (role instanceof Escapee) return 100
	else if (role instanceof CrimeSceneInvestigator) return 35
	else if (role instanceof Marksman) return 70
	else if (role instanceof TownBulletproof) return 60
	else if (role instanceof TownSocialiser) return 50
	else if (role instanceof TownNoU) return 40
	else if (role instanceof CorruptPolitician) return 90
	else if (role instanceof VanillaTownie) return 75
	else if (role instanceof TownInsuranceBroker) {
		//Shouldn't investigate themselves but good to be thorough
		return 35
	} else throw new Error("Unknown role")
}

const invite: RoleActionable = async (actionable, game) => {
	await game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Town-Insurance-Broker-invite",
		type: "invite",
	})

	const from = game.getPlayerOrThrow(actionable.from)
	const target = game.getPlayerOrThrow(actionable.to)
	const cost = getCost(target.role.role)

	game.addMessage(from, `:ticket: The cost to insure **${target.getDisplayName()}** is estimated to be **$${cost}**`)
}

export default invite
