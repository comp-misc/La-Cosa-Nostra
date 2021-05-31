import { instantiateRole } from "../../../systems/roles"
import ConsecutiveTargetConfig from "../../roles/roles/ConsecutiveTargetConfig"
import MafiaGoon from "../../roles/roles/mafia_goon"
import MafiaRoleCop from "../../roles/roles/mafia_role_cop"
import TownDoctor from "../../roles/roles/town_doctor"
import TownJailkeeper from "../../roles/roles/town_jailkeeper"
import TownMotionDetector from "../../roles/roles/town_motion_detector"
import TownRoleblocker from "../../roles/roles/town_roleblocker"
import TownTracker from "../../roles/roles/town_tracker"
import VanillaTownie from "../../roles/roles/town_vanilla_townie"
import TownVigilante, { KillStage } from "../../roles/roles/town_vigilante"
import TownVoyeur from "../../roles/roles/town_voyeur"
import JackOfAllTrades from "../roles/jack_of_all_trades"

const cooldownConfig: ConsecutiveTargetConfig = {
	sameTargetCooldown: 1,
}
export const mafiaGoon = instantiateRole(MafiaGoon)
export const mafiaRoleCop = instantiateRole(MafiaRoleCop, {
	allowMultipleActions: true,
})

export const townDoctor = instantiateRole(TownDoctor, cooldownConfig)
export const townVigilante = instantiateRole(TownVigilante, {
	stages: [KillStage.EVEN_NIGHT],
})
export const townJackOfAllTrades = instantiateRole(JackOfAllTrades)
export const townJailkeeper = instantiateRole(TownJailkeeper, cooldownConfig)
export const townMotionDetector = instantiateRole(TownMotionDetector)
export const townRoleblocker = instantiateRole(TownRoleblocker, cooldownConfig)
export const townTracker = instantiateRole(TownTracker)
export const vanillaTownie = instantiateRole(VanillaTownie)
export const townVoyeur = instantiateRole(TownVoyeur)
