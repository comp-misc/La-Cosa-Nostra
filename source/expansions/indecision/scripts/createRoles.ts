import { createRoleInfo, RoleInfo } from "../../../role"
import Town from "../../roles/roles/town"
import BasicMafia from "../../roles/roles/basic_mafia"
import Watcher from "../../roles/parts/watcher"
import RoleBlocker from "../../roles/parts/roleblocker"
import GodFather from "../../roles/parts/godfather"
import Goon from "../../roles/parts/goon"
import Tracker from "../../roles/parts/tracker"
import AlignmentCop from "../../roles/parts/alignment_cop"
import Vigilante from "../../roles/parts/vigilante"
import Doctor from "../../roles/parts/doctor"
import Bulletproof from "../../roles/parts/bulletproof"
import VanillaTownie from "../../roles/parts/vanilla_townie"
import SerialKiller from "../roles/serial_killer"

const createBasicRoles = (): { createVT: () => RoleInfo; otherRoles: RoleInfo[] } => {
	const town = new Town()
	const mafia = new BasicMafia({})

	const mafiaWatcher = createRoleInfo(mafia, new Watcher({}))
	const mafiaRoleBlocker = createRoleInfo(mafia, new RoleBlocker({}))
	const mafiaGodfather = createRoleInfo(mafia, new GodFather())
	const mafiaGoon = createRoleInfo(mafia, new Goon())

	const townTracker = createRoleInfo(town, new Tracker({}))
	const townAlignmentCop = createRoleInfo(
		town,
		new AlignmentCop({
			shots: 2,
		})
	)
	const townVigilante = createRoleInfo(
		town,
		new Vigilante({
			shots: 1,
		})
	)
	const townDoctor = createRoleInfo(town, new Doctor({}))
	const townBulletproof = createRoleInfo(town, new Bulletproof())

	const serialKiller = createRoleInfo(new SerialKiller())

	return {
		createVT: () => createRoleInfo(town, new VanillaTownie()),
		otherRoles: [
			serialKiller,
			mafiaWatcher,
			mafiaRoleBlocker,
			mafiaGodfather,
			mafiaGoon,
			townTracker,
			townAlignmentCop,
			townVigilante,
			townDoctor,
			townBulletproof,
		],
	}
}

export const createSetupRoles = (): RoleInfo[] => {
	const { createVT, otherRoles } = createBasicRoles()
	return [...otherRoles, ...Array.from({ length: 7 }, () => createVT())]
}

export const createPossibleRoles = (): RoleInfo[] => {
	const { createVT, otherRoles } = createBasicRoles()
	return [...otherRoles, createVT()]
}
