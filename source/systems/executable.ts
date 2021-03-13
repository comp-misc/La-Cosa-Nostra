//admin
import modkill from "./executable_admin/modkill"
import admin_substitute from "./executable_admin/substitute"

//conclusion
import endGame from "./executable_conclusion/endGame"
import setRoles from "./executable_conclusion/setRoles"

//misc
import __formatter from "./executable_misc/__formatter"
import addedLynch from "./executable_misc/addedLynch"
import addedNolynch from "./executable_misc/addedNolynch"
import broadcastMainLynch from "./executable_misc/broadcastMainLynch"
import changedLynch from "./executable_misc/changedLynch"
import clearReactions from "./executable_misc/clearReactions"
import createPrivateChannel from "./executable_misc/createPrivateChannel"
import createTrialVote from "./executable_misc/createTrialVote"
import deleteMessage from "./executable_misc/deleteMessage"
import editTrialVote from "./executable_misc/editTrialVote"
import getDeathBroadcast from "./executable_misc/getDeathBroadcast"
import getDeathMessage from "./executable_misc/getDeathMessage"
import kill from "./executable_misc/kill"
import lockMafiaChat from "./executable_misc/lockMafiaChat"
import lockMainChats from "./executable_misc/lockMainChats"
import lynch from "./executable_misc/lynch"
import lynchOff from "./executable_misc/lynchOff"
import lynchReached from "./executable_misc/lynchReached"
import nolynchOff from "./executable_misc/nolynchOff"
import nolynchReached from "./executable_misc/nolynchReached"
import openMafiaChat from "./executable_misc/openMafiaChat"
import openMainChats from "./executable_misc/openMainChats"
import pinMessage from "./executable_misc/pinMessage"
import postDelayNotice from "./executable_misc/postDelayNotice"
import postGameStart from "./executable_misc/postGameStart"
import postMafiaPeriodicMessage from "./executable_misc/postMafiaPeriodicMessage"
import postNewPeriod from "./executable_misc/postNewPeriod"
import postPrimeMessage from "./executable_misc/postPrimeMessage"
import postWinLog from "./executable_misc/postWinLog"
import postWinMessage from "./executable_misc/postWinMessage"
import removePlayerEmote from "./executable_misc/removePlayerEmote"
import removedLynch from "./executable_misc/removedLynch"
import removedNolynch from "./executable_misc/removedNolynch"
import sendAndPin from "./executable_misc/sendAndPin"
import sendIndivMessage from "./executable_misc/sendIndivMessage"
import sendPreemptMessage from "./executable_misc/sendPreemptMessage"
import unpinMessage from "./executable_misc/unpinMessage"
import updatePresence from "./executable_misc/updatePresence"

//roles
import getRole from "./executable_roles/getRole"
import postRoleIntroduction from "./executable_roles/postRoleIntroduction"
import uploadPublicRoleInformation from "./executable_roles/uploadPublicRoleInformation"

//wins
import checkWin from "./executable_wins/checkWin"

export = {
	admin: { modkill, substitute: admin_substitute },
	conclusion: { endGame, setRoles },
	misc: {
		__formatter,
		addedLynch,
		addedNolynch,
		broadcastMainLynch,
		changedLynch,
		clearReactions,
		createPrivateChannel,
		createTrialVote,
		deleteMessage,
		editTrialVote,
		getDeathBroadcast,
		getDeathMessage,
		kill,
		lockMafiaChat,
		lockMainChats,
		lynch,
		lynchOff,
		lynchReached,
		nolynchOff,
		nolynchReached,
		openMafiaChat,
		openMainChats,
		pinMessage,
		postDelayNotice,
		postGameStart,
		postMafiaPeriodicMessage,
		postNewPeriod,
		postPrimeMessage,
		postWinLog,
		postWinMessage,
		removePlayerEmote,
		removedLynch,
		removedNolynch,
		sendAndPin,
		sendIndivMessage,
		sendPreemptMessage,
		unpinMessage,
		updatePresence,
	},
	roles: { getRole, postRoleIntroduction, uploadPublicRoleInformation },
	wins: { checkWin },
}
