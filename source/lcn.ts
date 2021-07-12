// NOTE = the order matters!

import commands from "./commands"
import { Expansion } from "./Expansion"
import expansions from "./expansions"
import { LcnConfig } from "./LcnConfig"
import { LoadedRoleMetadata } from "./role"
import rolesystem from "./rolesystem/rolesystem"
import assets from "./systems/assets"
import attributes from "./systems/attributes"
import auxils from "./systems/auxils"
import config_handler from "./systems/config_handler"
import executable from "./systems/executable"
import flavours from "./systems/flavours"
import getRoles from "./systems/roles"
import win_conditions from "./systems/win_conditions"

interface Lcn {
	auxils: typeof auxils
	expansions: Expansion[]
	rolesystem: typeof rolesystem
	attributes: typeof attributes
	executable: typeof executable
	commands: typeof commands
	flavours: typeof flavours
	win_conditions: typeof win_conditions
	roles: Record<string, LoadedRoleMetadata>
	assets: typeof assets
	config: LcnConfig
}

let config = config_handler()

expansions.forEach((expansion) => {
	const script = expansion.scripts.start
	if (script) {
		config = script(config) || config
	}
})

const lcn: Lcn = {
	auxils,
	expansions,
	rolesystem,
	attributes,
	executable,
	commands,
	flavours,
	win_conditions,
	roles: getRoles(),
	assets,
	config,
}

export default lcn
