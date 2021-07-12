/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { CommandProperties, RoleCommand } from "../commands/CommandType"
import { KillCircumstances } from "../systems/game_templates/Game"
import Player from "../systems/game_templates/Player"
import { MergedRole } from "./MergedRole"
import { RoleDescriptor } from "./RoleDescriptor"
import { RolePart, PartialRoleProperties, RoutineProperties } from "./RolePart"

export abstract class BasicRolePart<T, S> implements RolePart<T, S> {
	readonly config: T
	readonly state: S

	abstract readonly commands: CommandProperties<RoleCommand>[]
	abstract readonly properties: PartialRoleProperties

	constructor(config: T, state: S) {
		this.config = config
		this.state = state
	}

	abstract formatDescriptor(descriptor: RoleDescriptor): void

	abstract routineProperties: RoutineProperties

	async onRoleStart(role: MergedRole): Promise<void> {}

	async onRoutines(player: Player): Promise<void> {}
	async onStart(player: Player): Promise<void> {}

	async onDeath(player: Player, circumstances: KillCircumstances): Promise<void> {}
	async onSubstitute(player: Player): Promise<void> {}

	async postAdditionalRoleInformation(player: Player): Promise<void> {}

	async broadcastActionMessage(from: Player, message: string): Promise<void> {}
}
