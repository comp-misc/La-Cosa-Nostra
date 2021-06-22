import { GameAssignScript } from "../../../Expansion"
import { instantiateRole } from "../../../systems/roles"
import Jester from "../../roles/roles/3p_jester"
import BaseMafiaConfig from "../../roles/roles/BaseMafiaConfig"
import MafiaGoon from "../../roles/roles/mafia_goon"
import MafiaRoleCop from "../../roles/roles/mafia_role_cop"
import TownBulletproof from "../../roles/roles/town_bulletproof"
import VanillaTownie from "../../roles/roles/town_vanilla_townie"
import CorruptPolitician from "../roles/corrupt_politician"
import MafiaEscapee from "../roles/mafia_escapee"
import MafiaLobbyist from "../roles/mafia_lobbyist"
import CrimeSceneInvestigator from "../roles/town_crime_scene_investigator"
import TownInsuranceBroker from "../roles/town_insurance_broker"
import TownMarksman from "../roles/town_marksman"
import TownNoU from "../roles/town_no_u"
import TownSocialiser from "../roles/town_socialiser"

const gameAssign: GameAssignScript = (config) => {
	const mafiaConfig: BaseMafiaConfig = {
		allowMultipleActions: true,
	}
	const jester = instantiateRole(Jester)
	const lobbyist = instantiateRole(MafiaLobbyist, mafiaConfig)
	const mafiaRolecop = instantiateRole(MafiaRoleCop, mafiaConfig)
	const mafiaGoon = instantiateRole(MafiaGoon)
	const mafiaEscapee = instantiateRole(MafiaEscapee)
	const crimeSceneInvestigator = instantiateRole(CrimeSceneInvestigator, {
		maximumUses: 2,
		totalSuspects: 3,
	})
	const marksman = instantiateRole(TownMarksman, {
		bullets: 1,
		killProbability: 0.7,
		missProbability: 0.15,
		selfInflictProbability: 0.15,
	})
	const townBulletproof = instantiateRole(TownBulletproof)
	const townSocialiser = instantiateRole(TownSocialiser)
	const townNou = instantiateRole(TownNoU, {
		maximumUses: 2,
	})
	const townInsuranceBroker = instantiateRole(TownInsuranceBroker)
	const corruptPolitician = instantiateRole(CorruptPolitician, mafiaConfig)

	return {
		...config,
		shuffle: true,
		roles: [
			jester, //a
			lobbyist, //b
			mafiaRolecop, //c
			mafiaGoon, //d
			mafiaEscapee, //e
			crimeSceneInvestigator, //f
			marksman, //g
			townBulletproof, //h
			townSocialiser, //i
			townNou, //j
			townInsuranceBroker, //k
			corruptPolitician, //l
			...Array.from({ length: 6 }, () => instantiateRole(VanillaTownie)), //m-r
		],
	}
}

export default gameAssign
