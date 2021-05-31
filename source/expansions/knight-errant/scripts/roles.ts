import { instantiateRole, instantiateRoleFromId } from "../../../systems/roles"
import MafiaBulletproof from "../../roles/roles/mafia_bulletproof"
import MafiaGodfather from "../../roles/roles/mafia_godfather"
import MafiaGoon from "../../roles/roles/mafia_goon"
import MafiaRoleblocker from "../../roles/roles/mafia_roleblocker"
import TownBulletproof from "../../roles/roles/town_bulletproof"
import TownDoctor from "../../roles/roles/town_doctor"
import TownJailkeeper from "../../roles/roles/town_jailkeeper"
import TownMason from "../../roles/roles/town_mason"
import TownRoleblocker from "../../roles/roles/town_roleblocker"
import TownTracker from "../../roles/roles/town_tracker"
import VanillaTownie from "../../roles/roles/town_vanilla_townie"

export const townCommuter = instantiateRoleFromId("town_3_shot_commuter")
export const mafiaBulletproof = instantiateRole(MafiaBulletproof)
export const townGunsmith = instantiateRoleFromId("town_gunsmith")
export const mafiaRoleblocker = instantiateRole(MafiaRoleblocker, {
	allowMultipleActions: true,
	sameTargetCooldown: 0,
})
export const mafiaGodfather = instantiateRole(MafiaGodfather)
export const townAlignmentCop = instantiateRoleFromId("town_alignment_cop")
export const mafiaEvenNightWatcher = instantiateRoleFromId("mafia_even_night_watcher")
export const townTracker = instantiateRole(TownTracker)
export const townJailkeeper = instantiateRole(TownJailkeeper, {
	sameTargetCooldown: 0,
})
export const townBulletproof = instantiateRole(TownBulletproof)
export const townRoleblocker = instantiateRole(TownRoleblocker, {
	sameTargetCooldown: 0,
})
export const townDoctor = instantiateRole(TownDoctor, {
	sameTargetCooldown: 0,
})
export const townMason = instantiateRole(TownMason)
export const mafiaGoon = instantiateRole(MafiaGoon)
export const vanillaTownie = instantiateRole(VanillaTownie)
