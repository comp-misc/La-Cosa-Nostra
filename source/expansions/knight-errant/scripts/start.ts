import { StartScript } from "../../../Expansion"
import override from "./override.json"
import objectOverride from "../../../auxils/objectOverride"

const start: StartScript = (config) => objectOverride(config, override)

export default start
