import { createRoleInfo, createRoleInfoFromId } from "../../../role"
import AlignmentCop from "../../roles/parts/alignment_cop"
import Bulletproof from "../../roles/parts/bulletproof"
import Commuter from "../../roles/parts/commuter"
import Doctor from "../../roles/parts/doctor"
import GodFather from "../../roles/parts/godfather"
import Goon from "../../roles/parts/goon"
import JailKeeper from "../../roles/parts/jailkeeper"
import Mason from "../../roles/parts/mason"
import Roleblocker from "../../roles/parts/roleblocker"
import Tracker from "../../roles/parts/tracker"
import VanillaTownie from "../../roles/parts/vanilla_townie"
import Watcher from "../../roles/parts/watcher"
import BasicMafia from "../../roles/roles/basic_mafia"
import Town from "../../roles/roles/town"

const town = new Town()
const mafia = new BasicMafia({
	singleAction: true,
})

export const mafiaBulletproof = createRoleInfo(mafia, new Bulletproof())
export const mafiaRoleblocker = createRoleInfo(mafia, new Roleblocker({ singleAction: true }))
export const mafiaGodfather = createRoleInfo(mafia, new GodFather())
export const mafiaEvenNightWatcher = createRoleInfo(mafia, new Watcher({ singleAction: true }))
export const mafiaGoon = createRoleInfo(mafia, new Goon())

export const townCommuter = createRoleInfo(town, new Commuter({ shots: 3 }))
export const townGunsmith = createRoleInfoFromId("knight-errant/town_gunsmith")
export const townAlignmentCop = createRoleInfo(
	town,
	new AlignmentCop({
		investigationImmuneResponse: "Town",
		alignmentResponses: {
			town: "Town",
			mafia: "Anti-Town",
			"3p": "Anti-Town",
		},
	})
)

export const townTracker = createRoleInfo(town, new Tracker({}))
export const townJailkeeper = createRoleInfo(town, new JailKeeper({}))
export const townBulletproof = createRoleInfo(town, new Bulletproof())
export const townRoleblocker = createRoleInfo(town, new Roleblocker({}))
export const townDoctor = createRoleInfo(town, new Doctor({}))
export const townMason = createRoleInfo(town, new Mason())
export const vanillaTownie = createRoleInfo(town, new VanillaTownie())
