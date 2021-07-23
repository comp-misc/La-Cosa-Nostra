import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import trackCmd from "./trackCmd"

export default class LazyTracker extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Lazy Tracker",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, trackCmd)
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("lazy_tracker/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Lazy Tracker"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "track",
			description:
				super.formatPeriodDescription() +
				", you may choose to track a player to determine whether they are visiting anyone. You will receive the report next morning",
			notes: super.getRoleDetails(),
		})
	}
}
