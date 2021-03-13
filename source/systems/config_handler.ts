import { LcnConfig } from "../LcnConfig"

const config_handlers = (file_dir = "configuration.json", allow_parent_override = true): LcnConfig => {
	/*Read the base config file as specified;
  merge other configurations and return
  one JSON object*/

	const base_config = require(`${__dirname}/../../configs/${file_dir}`)
	const config_pieces = base_config["merge-configs"]

	const combination = config_pieces.map((piece: string) => require(`${__dirname}/../../configs/${piece}`))

	if (allow_parent_override) {
		return Object.assign(base_config, ...combination)
	}

	return Object.assign(base_config, ...combination)
}

export = config_handlers
