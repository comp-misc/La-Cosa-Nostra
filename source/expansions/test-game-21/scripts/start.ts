import objectOverride from "../../../auxils/objectOverride"
import { StartScript } from "../../../systems/Expansion"
import override from "./override.json"

const start: StartScript = (config) => objectOverride(config, override)

export = start