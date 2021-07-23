import { Message } from "discord.js"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import { Actionable } from "../../../../systems/game_templates/Actions"
import Player from "../../../../systems/game_templates/Player"
import RemovableAction, { ExclusiveActionConfig } from "../RemovableAction"
import { sendDefaultDeselectMessage } from "../targetableRolePart/command"
import killCmd from "./killCmd"

export interface Config extends ExclusiveActionConfig {
	faction?: string
	actionName?: string
}

export interface KillActionableMeta {
	faction?: string
}

export default class MafiaFactionKill extends BasicRolePart<Config, null> implements RemovableAction {
	readonly commands: CommandProperties<RoleCommand>[]
	readonly properties: PartialRoleProperties = {}

	constructor(config: Config) {
		super(config, null)
		this.commands = [killCmd]
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.addDescription(RoleDescriptor.CATEGORY.FACTIONAL_ABILITIES, {
			name: "Kill",
			description:
				"Each night phase, you may send one member of your group to target another player in the game, attempting to kill them",
			notes: this.config.singleAction ? ["You may only use one action per night"] : [],
		})
	}

	routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_NIGHT: true,
		ALLOW_DEAD: false,
	}

	override async onRoutines(player: Player): Promise<void> {
		const game = player.getGame()
		await game.sendPeriodPin(
			player.getPrivateChannel(),
			":dagger: You may kill a player tonight using the faction kill.\n\n" +
				killCmd.formatUsageDescription(game.config)
		)
	}

	getExistingAction(from: Player): Actionable<unknown> | null {
		return from.getGame().actions.find((action) => this.actionMatches(action) && action.from === from.identifier)
	}

	async deselectExistingAction(from: Player, message: Message): Promise<void> {
		if (this.getExistingAction(from)) {
			from.getGame().actions.delete((action) => this.actionMatches(action))
			await sendDefaultDeselectMessage(":dagger:", "kill", from, message)
		}
	}

	actionMatches(action: Actionable<unknown>): boolean {
		if (action.identifier !== "mafia_faction_kill/kill") {
			return false
		}
		const castedAction = action as Actionable<KillActionableMeta>
		return !!castedAction.meta && castedAction.meta.faction === this.config.faction
	}
}
