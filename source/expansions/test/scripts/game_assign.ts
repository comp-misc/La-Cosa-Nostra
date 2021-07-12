import { GameAssignScript } from "../../../Expansion"
import { createRoleInfo } from "../../../role"
import Goon from "../../roles/parts/goon"
import JailKeeper from "../../roles/parts/jailkeeper"
import VanillaTownie from "../../roles/parts/vanilla_townie"
import Voyeur from "../../roles/parts/voyeur"
import BasicMafia from "../../roles/roles/basic_mafia"
import Town from "../../roles/roles/town"

const gameAssign: GameAssignScript = (config) => {
	const town = new Town()
	const mafia = new BasicMafia({})

	const townJailkeeper = createRoleInfo(town, new JailKeeper({}))
	const townVoyeur = createRoleInfo(town, new Voyeur({}))
	const mafiaGoon = createRoleInfo(mafia, new Goon())
	const vanillaTownie = createRoleInfo(town, new VanillaTownie())

	return {
		...config,
		roles: [mafiaGoon, townJailkeeper, townVoyeur, vanillaTownie],
		possibleRoles: [mafiaGoon, townJailkeeper, townVoyeur, vanillaTownie],
	}
}

export default gameAssign
