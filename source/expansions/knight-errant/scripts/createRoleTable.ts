import { SetupRole } from "../../../LcnConfig"
import {
	mafiaBulletproof,
	mafiaEvenNightWatcher,
	mafiaGodfather,
	mafiaRoleblocker,
	townAlignmentCop,
	townBulletproof,
	townCommuter,
	townDoctor,
	townGunsmith,
	townJailkeeper,
	townRoleblocker,
	townTracker,
} from "./roles"

export interface RoleTableBlock {
	role: SetupRole
	ability: string
}

const createRoleTable = (): RoleTableBlock[][] => {
	const roleTable: RoleTableBlock[][] = [
		[
			{ role: townCommuter, ability: "ability_commute" },
			{ role: mafiaBulletproof, ability: "ability_bulletproof" },
			{ role: townGunsmith, ability: "ability_gunsmith" },
			{ role: mafiaRoleblocker, ability: "ability_roleblock" },
		],
		[
			{ role: mafiaGodfather, ability: "ability_investigation_immunity" },
			{ role: townAlignmentCop, ability: "ability_investigate" },
			{ role: mafiaEvenNightWatcher, ability: "ability_watch" },
			{ role: townTracker, ability: "ability_track" },
		],
		[
			{ role: townJailkeeper, ability: "ability_jail" },
			{ role: mafiaRoleblocker, ability: "ability_roleblock" },
			{ role: townBulletproof, ability: "ability_bulletproof" },
			{ role: mafiaBulletproof, ability: "ability_bulletproof" },
		],
		[
			{ role: mafiaEvenNightWatcher, ability: "ability_watch" },
			{ role: townRoleblocker, ability: "ability_roleblock" },
			{ role: mafiaGodfather, ability: "ability_investigation_immunity" },
			{ role: townDoctor, ability: "ability_heal" },
		],
	]
	return roleTable
}

export default createRoleTable
