import objectOverride from "../../../source/auxils/objectOverride"
import { StartScript } from "../../../source/systems/Expansion"
import override from "./override.json"

const start: StartScript = (config) => objectOverride(config, override)

export = start
