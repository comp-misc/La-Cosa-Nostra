import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import investigateCmd from "./investigateCmd"

export default class RoleCop extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Role Cop",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, investigateCmd)
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("role_cop/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Role Cop"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Investigate",
			description:
				super.formatPeriodDescription() +
				", you may choose to investigate a player to determine their role. You will receive the report next morning.",
			notes: super.getRoleDetails(),
		})
	}
}
