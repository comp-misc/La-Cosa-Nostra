import { PartialRoleProperties, RoleDescriptor } from "../../../../role"
import commuteCmd from "./commuteCmd"
import ActionToggleRolePart, {
	ActionToggleRoleConfig,
	ActionToggleRoleState,
	DEFAULT_STATE,
} from "../actionToggleRolePart"

export default class Commuter extends ActionToggleRolePart {
	readonly properties: PartialRoleProperties = {
		investigation: "Commuter",
	}

	constructor(config: ActionToggleRoleConfig, state?: ActionToggleRoleState) {
		super(config, state || DEFAULT_STATE, commuteCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Commuter"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "Commute",
			description:
				super.formatPeriodDescription() +
				", you may choose to commute. As a result of this, all actions towards you will fail",
			notes: super.getRoleDetails(),
		})
	}
}
