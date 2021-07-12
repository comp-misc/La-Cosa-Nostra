import { PartialRoleProperties, RoleDescriptor } from "../../../../role"
import Player from "../../../../systems/game_templates/Player"
import TargetableRolePart, {
	DEFAULT_STATE,
	TargetableRoleConfig,
	TargetableRoleState,
} from "../../../roles/parts/targetableRolePart"
import PartyMember from "../party_member"
import inviteCmd from "./inviteCmd"

export default class Socialiser extends TargetableRolePart<TargetableRoleConfig, TargetableRoleState> {
	readonly properties: PartialRoleProperties = {
		investigation: "Socialiser",
	}

	constructor(config: TargetableRoleConfig, state?: TargetableRoleState) {
		super(config, state || DEFAULT_STATE, inviteCmd)
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Socialiser"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "Party Invite",
			description:
				super.formatPeriodDescription() +
				", you may choose to invite a player to the party, adding them to shared night chat",
			notes: [
				"Only certain types of payer will accept your invitation",
				"Attempting to invite Mafia will result in your death",
				...super.getRoleDetails(),
			],
		})
	}

	async addPlayerToParty(player: Player, showMessage = true): Promise<void> {
		const game = player.getGame()
		const partyRole = new PartyMember()
		await player.role.addPart(partyRole)

		if (showMessage) {
			await game.sendPin(
				partyRole.getTextChannel(player.getGame()),
				":tada: <@" + player.id + "> has been added to the party!"
			)
		}
	}
}
