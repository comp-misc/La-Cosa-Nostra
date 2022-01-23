import ActionToggleRolePart from "./RolePart"
import { ActionToggleRoleState } from "./types"

export * from "./types"

export const DEFAULT_STATE: ActionToggleRoleState = {
	shotsUsed: 0,
	periodsUsedAction: [],
}

export default ActionToggleRolePart
