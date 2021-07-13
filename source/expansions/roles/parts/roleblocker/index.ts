import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import roleblockCmd from "./roleblockCmd"

export default class RoleBlocker extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Roleblocker",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, roleblockCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Roleblocker"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Roleblock",
			description:
				super.formatPeriodDescription() +
				", you may choose to roleblock a player to block them from performing any night actions. This action cannot be roleblocked",
			notes: super.getRoleDetails(),
		})
	}
}
