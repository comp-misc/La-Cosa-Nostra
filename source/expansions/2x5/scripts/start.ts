import { StartScript } from "../../../Expansion"
import override from "./override.json"
import * as possibleRoles from "./roles"

const start: StartScript = (config) => {
	const newConfig = {
		...config,
		...override,
	}
	newConfig.playing.possibleRoles = Object.values(possibleRoles)
	return newConfig
}

export default start
