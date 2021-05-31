import { ProgrammableRole, Role } from "../Role"
import FlavourRole from "./FlavourRole"
import Player from "./Player"

export default class PlayerRole<T = unknown> extends FlavourRole<T> {
	constructor(role: Role<ProgrammableRole<T>, T>, player: Player) {
		super(role, player.getGame().config, player.getGame().getGameFlavour() || undefined)
	}
}
