import { StartScript } from "../../../Expansion"
import { createRoleInfo } from "../../../role"
import Goon from "../../roles/parts/goon"
import JailKeeper from "../../roles/parts/jailkeeper"
import Neighbour from "../../roles/parts/neighbour"
import Roleblocker from "../../roles/parts/roleblocker"
import RoleCop from "../../roles/parts/role_cop"
import Tracker from "../../roles/parts/tracker"
import VanillaTownie from "../../roles/parts/vanilla_townie"
import BasicMafia from "../../roles/roles/basic_mafia"
import Town from "../../roles/roles/town"
import SerialKiller from "../roles/serial_killer"

const start: StartScript = (config) => {
	const mafia = new BasicMafia({ singleAction: true })
	const town = new Town()

	const goon = createRoleInfo(mafia, new Goon())
	const vt = createRoleInfo(town, new VanillaTownie())

	const sk = createRoleInfo(new SerialKiller())

	const partialRoles = [
		new Tracker({ singleAction: true }),
		new JailKeeper({ singleAction: true }),
		new RoleCop({ singleAction: true }),
		new Roleblocker({ singleAction: true }),
		new Neighbour({
			channelName: "neighbours-chat",
			phase: "night",
		}),
	]
	const townRoles = [vt, ...partialRoles.map((part) => createRoleInfo(town, part))]
	const mafiaRoles = [goon, ...partialRoles.map((part) => createRoleInfo(mafia, part))]

	return {
		...config,
		messages: {
			...config.messages,
			name: "Phistomaphel Mafia",
			"game-start":
				"**Welcome to Phistomaphel Mafia.**\nThis is the general chat channel and the primary platform for gameplay discussion. All players are able to see this channel.",
		},
		game: {
			...config.game,
			playersNeeded: 17,
			"show-roles": true,
		},
		playing: {
			...config.playing,
			possibleRoles: [...mafiaRoles, ...townRoles, sk],
		},
		time: {
			...config.time,
			day: 24,
			night: 12,
		},
	}
}

export default start
