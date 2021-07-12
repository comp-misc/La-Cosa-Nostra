import { GameAssignScript } from "../../../Expansion"
import { createRoleInfo } from "../../../role"
import Bulletproof from "../../roles/parts/bulletproof"
import Goon from "../../roles/parts/goon"
import RoleCop from "../../roles/parts/role_cop"
import VanillaTownie from "../../roles/parts/vanilla_townie"
import BasicMafia from "../../roles/roles/basic_mafia"
import Jester from "../../roles/roles/jester"
import Town from "../../roles/roles/town"
import CrimeSceneInvestigator from "../parts/crime_scene_investigator"
import Escapee from "../parts/escapee"
import InsuranceBroker from "../parts/insurance_broker"
import Lobbyist from "../parts/lobbyist"
import Marksman from "../parts/marksman"
import NoU from "../parts/no_u"
import Socialiser from "../parts/socialiser"
import CorruptPolitician from "../roles/corrupt_politician"

const gameAssign: GameAssignScript = (config) => {
	const town = new Town()
	const mafia = new BasicMafia({})

	const jester = createRoleInfo(new Jester())

	const lobbyist = createRoleInfo(mafia, new Lobbyist({}))
	const mafiaRolecop = createRoleInfo(mafia, new RoleCop({}))
	const mafiaGoon = createRoleInfo(mafia, new Goon())
	const mafiaEscapee = createRoleInfo(mafia, new Escapee())

	const crimeSceneInvestigator = createRoleInfo(
		town,
		new CrimeSceneInvestigator({
			uses: 2,
			totalSuspects: 3,
		})
	)
	const marksman = createRoleInfo(
		town,
		new Marksman({
			bullets: 1,
			killProbability: 1,
			missProbability: 0,
			selfInflictProbability: 0,
		})
	)
	const townBulletproof = createRoleInfo(town, new Bulletproof())
	const townSocialiser = createRoleInfo(town, new Socialiser({}))
	const townNoU = createRoleInfo(
		town,
		new NoU({
			maximumUses: 2,
		})
	)

	const townInsuranceBroker = createRoleInfo(town, new InsuranceBroker({}))
	const corruptPolitician = createRoleInfo(new CorruptPolitician())

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
			townNoU, //j
			townInsuranceBroker, //k
			corruptPolitician, //l
			...Array.from({ length: 6 }, () => createRoleInfo(town, new VanillaTownie())), //m-r
		],
	}
}

export default gameAssign
