import { LcnConfig } from "../LcnConfig"

/*Read the base config file as specified;
  merge other configurations and return
  one JSON object*/
const config_handlers = (file_dir = "configuration.json", allow_parent_override = true): LcnConfig => {
	/* eslint-disable @typescript-eslint/no-var-requires */
	/* eslint-disable @typescript-eslint/no-unsafe-assignment */

	const base_config = require(`${__dirname}/../../configs/${file_dir}`) as LcnConfig
	const config_pieces = base_config["merge-configs"]

	const combination = config_pieces.map(
		(piece: string) => require(`${__dirname}/../../configs/${piece}`) as Record<string, unknown>
	)

	if (allow_parent_override) {
		return Object.assign(base_config, ...combination) as LcnConfig
	}

	return Object.assign(base_config, ...combination) as LcnConfig
}

export default config_handlers
