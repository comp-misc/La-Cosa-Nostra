import { CompleteRole, MergedRole, RoleInfo, RolePart } from "../../role"
import Player from "./Player"

export default class PlayerRole extends MergedRole {
	private readonly player: Player

	constructor(player: Player, roleInfo: RoleInfo) {
		super(roleInfo, player.getGame().getGameFlavour() || undefined)
		this.player = player
	}

	override getDescription(): string {
		return super.getDescription(this.player.getGame().config.messages.name)
	}

	override async addPart(part: RolePart<unknown, unknown>, callOnStart = true): Promise<void> {
		await super.addPart(part)

		if (callOnStart) {
			await part.onStart(this.player)
		}
		this.player.getGame().actions.refreshActionables()
	}

	override async changeMainRole(role: CompleteRole<unknown, unknown>, callOnStart = true): Promise<void> {
		await super.changeMainRole(role)

		if (callOnStart) {
			await role.onStart(this.player)
		}
		this.player.getGame().actions.refreshActionables()

		//New role may have a new win condition
		await this.player.getGame().checkWin()
	}
}
