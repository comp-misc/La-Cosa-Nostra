import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import monitorCmd from "./monitorCmd"

export default class MotionDetector extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Motion Detector",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, monitorCmd)
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("motion_detector/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Motion Detector"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Monitor",
			description:
				super.formatPeriodDescription() +
				", you may choose to monitor a player to see if any actions were performed by or on them, but not what or by who. You will receive the report next morning",
			notes: super.getRoleDetails(),
		})
	}
}
