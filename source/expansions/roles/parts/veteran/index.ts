import ActionToggleRolePart, { ActionToggleRoleConfig, ActionToggleRoleState } from "../actionToggleRolePart"
import { PartialRoleProperties, RoleDescriptor } from "../../../../role"
import onGuardCmd from "./onGuardCmd"

export default class Veteran extends ActionToggleRolePart {
	constructor(config: ActionToggleRoleConfig, state: ActionToggleRoleState) {
		super(config, state, onGuardCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Veteran"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "On Guard",
			description:
				super.formatPeriodDescription() +
				", you may choose to go on guard, killing any player who visits you. This action cannot be role blocked",
			notes: [...super.getRoleDetails()],
		})
	}

	readonly properties: PartialRoleProperties = {
		investigation: "Veteran",
	}
}
