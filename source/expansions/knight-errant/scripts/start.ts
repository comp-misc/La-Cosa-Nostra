import { StartScript } from "../../../Expansion"
import override from "./override.json"
import objectOverride from "../../../auxils/objectOverride"
import * as allRoles from "./roles"
import { instantiateRole } from "../../../systems/roles"
import SerialKiller, { SerialKillerConfig } from "../roles/serial_killer"

const start: StartScript = (config) => {
	//Create a bogus sk with no abilities for role detailing
	const sk = instantiateRole(SerialKiller, {
		abilities: [],
	} as SerialKillerConfig)

	const resultConfig = objectOverride(config, override)
	resultConfig.playing.possibleRoles = [...Object.values(allRoles), sk]
	return resultConfig
}

export default start
