import { GameAssignScript } from "../../../source/systems/Expansion"
import objectOverride from "../../../source/auxils/objectOverride"
import roles_override from "./setup.json"

const gameAssign: GameAssignScript = (playing) => objectOverride(playing, roles_override)

export = gameAssign
