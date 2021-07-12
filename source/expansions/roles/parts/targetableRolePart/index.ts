import TargetableRolePart from "./RolePart"
import { TargetableRoleState } from "./types"

export * from "./types"
export { TargetableRoleCommand, sendDefaultActionMessage, sendDefaultNoActionMessage } from "./command"

export const DEFAULT_STATE: TargetableRoleState = {
	shotsUsed: 0,
	targets: [],
}

export default TargetableRolePart
