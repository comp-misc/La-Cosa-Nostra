import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import protectCmd from "./protectCmd"

export default class Doctor extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Doctor",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, protectCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Doctor"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Protect",
			description:
				super.formatPeriodDescription() +
				", you may choose to protect (heal) a player. This protects them from a single night kill",
			notes: super.getRoleDetails(),
		})
	}
}
