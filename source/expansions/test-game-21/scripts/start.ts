import objectOverride from "../../../auxils/objectOverride"
import { StartScript } from "../../../Expansion"
import override from "./override.json"

const start: StartScript = (config) => objectOverride(config, override)

export = start
