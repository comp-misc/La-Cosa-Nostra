import objectOverride from "../../../auxils/objectOverride"
import { StartScript } from "../../../Expansion"
import { createRoleInfo } from "../../../role"
import SerialKiller from "../roles/serial_killer"
import override from "./override.json"
import * as allRoles from "./roles"

const start: StartScript = (config) => {
	//Create a bogus sk with no abilities for role detailing
	const sk = createRoleInfo(
		new SerialKiller({
			abilities: [],
		})
	)
	const ar = allRoles
	const resultConfig = objectOverride(config, override)
	resultConfig.playing.possibleRoles = [...Object.values(ar), sk]
	return resultConfig
}

export default start
