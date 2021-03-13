// NOTE = the order matters!

import config_handler from "./systems/config_handler"

import auxils from "./systems/auxils"
import expansions from "./systems/expansions"
import rolesystem from "./rolesystem/rolesystem"
import attributes from "./systems/attributes"
import executable from "./systems/executable"
import commands from "./systems/commands"
import flavours from "./systems/flavours"
import win_conditions from "./systems/win_conditions"
import actionables from "./systems/actionables"
import roles from "./systems/roles"
import assets from "./systems/assets"
import { LcnConfig } from "./LcnConfig"
import { Expansion } from "./systems/Expansion"

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
	roles: typeof roles
	assets: typeof assets
	config: LcnConfig
}

let config = config_handler() as LcnConfig
const default_config = config

expansions.forEach((expansion) => {
	const script = expansion.scripts.start
	if (script) {
		config = script(config) || config
	}
})

// Enforce defaults on parameters
const enforce_default = [
	"command-prefix",
	"automatically-load-saves",
	"encode-cache",
	"merge-configs",
	"playing",
	"console-log-level",
	"file-log-level",
	"allow-config-override-subprocess",
]

const copyDefault = <K extends keyof LcnConfig>(key: K) => {
	config[key] = default_config[key]
}

enforce_default.forEach((key) => {
	copyDefault<any>(key)

	Object.defineProperty(config, key, {
		writable: false,
	})
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
	roles,
	assets,
	config,
}

export = lcn
