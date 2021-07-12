import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, { DEFAULT_STATE, TargetableRoleConfig, TargetableRoleState } from "../targetableRolePart"
import watchCmd from "./watchCmd"

export default class Voyeur extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Voyeur",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, watchCmd)
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("voyeur/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Voyeur"
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Watch",
			description:
				super.formatPeriodDescription() +
				", you may choose to watch a player to see what actions were performed on them. You will receive the report next morning",
			notes: super.getRoleDetails(),
		})
	}
}
