import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import trackCmd from "./trackCmd"

export default class Tracker extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Tracker",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, trackCmd)
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("tracker/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Tracker"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "track",
			description:
				super.formatPeriodDescription() +
				", you may choose to track a player to see which players they visited, if any. You will receive the report next morning",
			notes: super.getRoleDetails(),
		})
	}
}
