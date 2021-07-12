import { BasicDescriptionCategory, PartialRoleProperties, RoleDescriptor } from "../../../../role"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, {
	DEFAULT_STATE,
	TargetableRoleConfig,
	TargetableRoleState,
} from "../../../roles/parts/targetableRolePart"
import bribeCmd from "./bribeCmd"

const flavourText = `
While most players have sound ethics, there are others who may change their alignment for selfish gain.
In this setup, there exists one player who is Town aligned, but can be converted to Mafia with bribes.

Bribed players will be added to Mafia chat and be able to perform night kills
`

export default class Lobbyist extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Lobbyist",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, bribeCmd)
	}

	override async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("lobbyist/roleblock_noresult", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Lobbyist"
		descriptor.flavorText = flavourText.trim()
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Bribe",
			description: super.formatPeriodDescription() + ", you may attempt to bribe a player to join the Mafia",
			notes: super.getRoleDetails(),
		})
	}
}
