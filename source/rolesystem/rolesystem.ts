import fs from "fs"

import requireScript from "../auxils/requireScript"
import objectOverride from "../auxils/objectOverride"

import expansions from "../expansions"

import misc from "./misc"
import modular from "./modular"
import protocol from "./protocol"
import prototypes from "./prototypes"

let rolesystem = {
	misc,
	modular,
	protocol,
	prototypes,
}

for (const expansion of expansions) {
	const directory = expansion.expansion_directory + "/rolesystem/"
	if (!fs.existsSync(directory)) {
		continue
	}

	const expansionRS: Record<string, Record<string, unknown>> = {}
	for (const folder of fs.readdirSync(directory)) {
		if (!fs.lstatSync(directory).isDirectory()) {
			continue
		}

		const folderRs: Record<string, unknown> = {}
		for (const script of fs.readdirSync(directory + "/" + folder)) {
			if (script.toLowerCase().endsWith(".ts") || script.toLowerCase().endsWith(".js")) {
				folderRs[script.substring(0, script.length - 3)] = requireScript(
					directory + "/" + folder + "/" + script
				)
			}
		}
		expansionRS[folder] = folderRs
	}

	// Concatenate
	rolesystem = objectOverride(rolesystem, expansionRS)
}

export default rolesystem
