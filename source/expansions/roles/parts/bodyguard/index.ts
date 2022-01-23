import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import bodyguardCmd from "./bodyguardCmd"

export default class BodyGuard extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Bodyguard",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, bodyguardCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Bodyguard"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Bodyguard",
			description:
				super.formatPeriodDescription() +
				`, you may choose to bodyguard. Redirects kill attempts on your target onto you ("taking the bullet" for them)`,
			notes: ["Only may protect your target from a single kill", ...super.getRoleDetails()],
		})
	}
}
