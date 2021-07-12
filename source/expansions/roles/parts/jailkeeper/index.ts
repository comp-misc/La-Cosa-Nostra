import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import jailCmd from "./jailCmd"

export default class JailKeeper extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Jailkeeper",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, jailCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Jailkeeper"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Jail",
			description:
				super.formatPeriodDescription() +
				", you may choose to jail a player. This results in both a protection and roleblock for your target",
			notes: super.getRoleDetails(),
		})
	}
}
