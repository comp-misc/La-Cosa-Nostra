import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import TargetableRolePart, {
	DEFAULT_STATE,
	TargetableRoleConfig,
	TargetableRoleState,
} from "../../../roles/parts/targetableRolePart"
import insureCmd from "./insureCmd"

export default class InsuranceBroker extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Insurance Broker",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, insureCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Insurance Broker"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Produce a Quote",
			description: super.formatPeriodDescription() + ", you may produce a quote for the cost to insure a player",
			notes: ["Players with a higher risk to town will cost more to insure", ...super.getRoleDetails()],
		})
	}
}
