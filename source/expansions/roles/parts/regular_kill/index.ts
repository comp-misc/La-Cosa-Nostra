import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import killCmd from "./killCmd"

export default class RegularKill extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, killCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Kill",
			description: super.formatPeriodDescription() + ", you may choose to kill a player",
			notes: super.getRoleDetails(),
		})
	}
}
