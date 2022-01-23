import ActionToggleRolePart, { ActionToggleRoleConfig, ActionToggleRoleState } from "../actionToggleRolePart"
import mirrorCmd from "./mirrorCmd"
import { PartialRoleProperties, RoleDescriptor } from "../../../../role"

export default class Mirror extends ActionToggleRolePart {
	constructor(config: ActionToggleRoleConfig, state: ActionToggleRoleState) {
		super(config, state, mirrorCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Mirror"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "Mirror",
			description:
				super.formatPeriodDescription() +
				", you may choose to enable mirror mode. All actions targeted at you will be mirrored onto the initiator",
			notes: [...super.getRoleDetails()],
		})
	}

	readonly properties: PartialRoleProperties = {
		investigation: "Mirror",
	}
}
