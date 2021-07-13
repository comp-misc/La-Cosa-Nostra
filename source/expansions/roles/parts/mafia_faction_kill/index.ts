import { Message } from "discord.js"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { TargetCommand } from "../../../../commands/createTargetCommand"
import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import { Actionable } from "../../../../systems/game_templates/Actions"
import Player from "../../../../systems/game_templates/Player"
import RemovableAction, { ExclusiveActionConfig } from "../RemovableAction"
import { sendDefaultDeselectMessage } from "../targetableRolePart/command"
import createKillCmd from "./killCmd"

export default class MafiaFactionKill extends BasicRolePart<ExclusiveActionConfig, null> implements RemovableAction {
	readonly commands: CommandProperties<RoleCommand>[]
	readonly properties: PartialRoleProperties = {}

	private readonly killCmd: TargetCommand

	constructor(config: ExclusiveActionConfig) {
		super(config, null)
		this.killCmd = createKillCmd(this)
		this.commands = [this.killCmd]
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
				this.killCmd.formatUsageDescription(game.config)
		)
	}

	getExistingAction(from: Player): Actionable<unknown> | null {
		return from
			.getGame()
			.actions.find(
				(action) => action.identifier === "mafia_faction_kill/kill" && action.from === from.identifier
			)
	}

	async deselectExistingAction(from: Player, message: Message): Promise<void> {
		if (this.getExistingAction(from)) {
			from.getGame().actions.delete((action) => action.identifier === "mafia_faction_kill/kill")
			await sendDefaultDeselectMessage(":dagger:", "kill", from, message)
		}
	}
}
