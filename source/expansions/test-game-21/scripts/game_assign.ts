import { GameAssignScript } from "../../../systems/Expansion"
import objectOverride from "../../../auxils/objectOverride"
import roles_override from "./setup.json"

const gameAssign: GameAssignScript = (playing) => {
	const result = objectOverride(playing, roles_override)
	return result
}

export = gameAssign
