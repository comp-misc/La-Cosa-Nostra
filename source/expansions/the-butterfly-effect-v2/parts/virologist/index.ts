import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import TargetableRolePart, {
	DEFAULT_STATE,
	TargetableRoleConfig,
	TargetableRoleState,
} from "../../../roles/parts/targetableRolePart"
import cureCmd from "./cureCmd"

export default class Virologist extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Virologist",
	}

	constructor(config?: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config || {}, state || DEFAULT_STATE, cureCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Virologist"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Cure",
			description:
				super.formatPeriodDescription() +
				", you may choose to cure the infection from a player. If you have been infected, you will instead end up infecting your target",
			notes: ["You cannot be infected by players you visit", ...super.getRoleDetails()],
		})
	}
}
