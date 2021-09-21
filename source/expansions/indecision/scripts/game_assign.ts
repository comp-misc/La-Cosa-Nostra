import { GameAssignScript } from "../../../Expansion"
import { createSetupRoles } from "./createRoles"

const gameAssign: GameAssignScript = (config) => {
	return {
		...config,
		shuffle: true,
		roles: createSetupRoles(),
	}
}

export default gameAssign
