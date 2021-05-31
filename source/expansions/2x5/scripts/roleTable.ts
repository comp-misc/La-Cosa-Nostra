import {
	mafiaGoon,
	mafiaRoleCop,
	townDoctor,
	townJackOfAllTrades,
	townJailkeeper,
	townMotionDetector,
	townRoleblocker,
	townTracker,
	townVigilante,
	townVoyeur,
} from "./roles"

export const mafiaRoleTable = [
	[mafiaGoon, mafiaGoon, mafiaGoon, mafiaGoon],
	[mafiaGoon, mafiaGoon, mafiaGoon, mafiaRoleCop],
]
export const townRoleTable = [
	[
		[townVigilante, townRoleblocker, townVoyeur],
		[townVigilante, townJailkeeper],
		[townTracker, townJailkeeper],
		[townTracker, townRoleblocker, townVoyeur],
		[townDoctor, townJackOfAllTrades],
	],

	[
		[townVigilante, townRoleblocker, townTracker],
		[townVigilante, townJailkeeper, townVoyeur],
		[townTracker, townJailkeeper, townVoyeur],
		[townJackOfAllTrades, townVigilante, townMotionDetector],
		[townDoctor, townRoleblocker, townMotionDetector],
	],
]
