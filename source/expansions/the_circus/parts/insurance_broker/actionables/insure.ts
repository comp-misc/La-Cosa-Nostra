import TownInsuranceBroker from ".."
import { RoleActionable } from "../../../../../systems/actionables"
import PlayerRole from "../../../../../systems/game_templates/PlayerRole"
import Bulletproof from "../../../../roles/parts/bulletproof"
import Goon from "../../../../roles/parts/goon"
import RoleCop from "../../../../roles/parts/role_cop"
import VanillaTownie from "../../../../roles/parts/vanilla_townie"
import Jester from "../../../../roles/roles/jester"
import CorruptPolitician from "../../../roles/corrupt_politician"
import Escapee from "../../escapee"
import CrimeSceneInvestigator from "../../crime_scene_investigator"
import Lobbyist from "../../lobbyist"
import Marksman from "../../marksman"
import NoU from "../../no_u"
import Socialiser from "../../socialiser"

const getCost = (role: PlayerRole): number => {
	if (role.hasPart(Jester)) return 100
	else if (role.hasPart(Lobbyist)) return 150
	else if (role.hasPart(RoleCop)) return 150
	else if (role.hasPart(Goon)) return 125
	else if (role.hasPart(Escapee)) return 100
	else if (role.hasPart(CrimeSceneInvestigator)) return 35
	else if (role.hasPart(Marksman)) return 70
	else if (role.hasPart(Bulletproof)) return 60
	else if (role.hasPart(Socialiser)) return 50
	else if (role.hasPart(NoU)) return 40
	else if (role.hasPart(CorruptPolitician)) return 90
	else if (role.hasPart(VanillaTownie)) return 75
	else if (role.hasPart(TownInsuranceBroker)) {
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
	const cost = getCost(target.role)

	game.addMessage(from, `:ticket: The cost to insure **${target.getDisplayName()}** is estimated to be **$${cost}**`)
}

export default invite
