import { GameAssignScript } from "../../../Expansion"
import { instantiateRole, instantiateRoleFromId } from "../../../systems/roles"
import MafiaGoon from "../../roles/roles/mafia_goon"
// import MafiaRoleblocker from "../../roles/roles/mafia_roleblocker"
import TownJailkeeper from "../../roles/roles/town_jailkeeper"
import TownVoyeur from "../../roles/roles/town_voyeur"

const gameAssign: GameAssignScript = (config) => {
	const townJailkeeper = instantiateRole(TownJailkeeper, {
		sameTargetCooldown: 0,
	})
	const townVoyeur = instantiateRole(TownVoyeur)
	// const mafiaRoleblocker = instantiateRole(MafiaRoleblocker, {
	// 	allowMultipleActions: true,
	// 	sameTargetCooldown: 0,
	// })
	const mafiaGoon = instantiateRole(MafiaGoon)
	const vanillaTownie = instantiateRoleFromId("town_vanilla_townie")

	return {
		...config,
		roles: [mafiaGoon, townVoyeur, townJailkeeper, vanillaTownie],
		possibleRoles: [mafiaGoon, townJailkeeper, vanillaTownie, townVoyeur],
	}
}

export default gameAssign
