// NOTE = the order matters!

import config_handler from "./systems/config_handler"

import auxils from "./systems/auxils"
import expansions from "./expansions"
import rolesystem from "./rolesystem/rolesystem"
import attributes from "./systems/attributes"
import executable from "./systems/executable"
import commands from "./commands"
import flavours from "./systems/flavours"
import win_conditions from "./systems/win_conditions"
import actionables from "./systems/actionables"
import getRoles from "./systems/roles"
import assets from "./systems/assets"
import { LcnConfig } from "./LcnConfig"
import { Expansion } from "./Expansion"
import { ProgrammableRole, RoleMetadata } from "./systems/Role"

interface Lcn {
	auxils: typeof auxils
	expansions: Expansion[]
	rolesystem: typeof rolesystem
	attributes: typeof attributes
	executable: typeof executable
	commands: typeof commands
	flavours: typeof flavours
	win_conditions: typeof win_conditions
	actionables: typeof actionables
	roles: Record<string, RoleMetadata<ProgrammableRole<unknown>, unknown>>
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
	actionables,
	roles: getRoles(),
	assets,
	config,
}

export default lcn
