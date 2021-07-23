import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, {
	DEFAULT_STATE,
	TargetableRoleConfig,
	TargetableRoleState,
} from "../../../roles/parts/targetableRolePart"
import recruitCmd from "./recruitCmd"

interface Config extends TargetableRoleConfig {
	team: 1 | 2
}

export default class Recruiter extends TargetableRolePart<Config, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {}

	constructor(config: Config, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, recruitCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.addDescription(BasicDescriptionCategory.FACTIONAL_ABILITIES, {
			name: "Recruit",
			description:
				super.formatPeriodDescription() + ", you may choose a player to recruit them to your mafia team",
			notes: super.getRoleDetails(),
		})
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("recruiter/roleblocked", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}
}
