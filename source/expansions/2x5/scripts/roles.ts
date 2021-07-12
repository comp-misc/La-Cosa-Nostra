import { createRoleInfo } from "../../../role"
import Doctor from "../../roles/parts/doctor"
import Goon from "../../roles/parts/goon"
import JailKeeper from "../../roles/parts/jailkeeper"
import MotionDetector from "../../roles/parts/motion_detector"
import Roleblocker from "../../roles/parts/roleblocker"
import RoleCop from "../../roles/parts/role_cop"
import { RoleUsePeriod } from "../../roles/parts/targetableRolePart"
import Tracker from "../../roles/parts/tracker"
import VanillaTownie from "../../roles/parts/vanilla_townie"
import Vigilante from "../../roles/parts/vigilante"
import Voyeur from "../../roles/parts/voyeur"
import BasicMafia from "../../roles/roles/basic_mafia"
import Town from "../../roles/roles/town"
import JackOfAllTrades from "../parts/jack_of_all_trades"

const town = new Town()
const mafia = new BasicMafia({})

export const mafiaGoon = createRoleInfo(mafia, new Goon())
export const mafiaRoleCop = createRoleInfo(mafia, new RoleCop({}))

export const townDoctor = createRoleInfo(town, new Doctor({ sameTargetCooldown: 1 }))
export const townVigilante = createRoleInfo(
	town,
	new Vigilante({
		periods: {
			type: "even",
			on: RoleUsePeriod.NIGHT,
		},
	})
)

export const townJackOfAllTrades = createRoleInfo(town, new JackOfAllTrades())

export const townJailkeeper = createRoleInfo(town, new JailKeeper({ sameTargetCooldown: 1 }))
export const townMotionDetector = createRoleInfo(town, new MotionDetector({}))
export const townRoleblocker = createRoleInfo(town, new Roleblocker({ sameTargetCooldown: 1 }))
export const townTracker = createRoleInfo(town, new Tracker({}))
export const vanillaTownie = createRoleInfo(town, new VanillaTownie())
export const townVoyeur = createRoleInfo(town, new Voyeur({}))
