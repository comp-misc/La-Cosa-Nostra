import { Message } from "discord.js"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import { BasicRolePart, PartialRoleProperties, RoleDescriptor, RoutineProperties } from "../../../../role"
import { Actionable } from "../../../../systems/game_templates/Actions"
import Player from "../../../../systems/game_templates/Player"
import RemovableAction, { ExclusiveActionConfig } from "../RemovableAction"
import { sendDefaultDeselectMessage } from "../targetableRolePart/command"
import commuteCmd from "./commuteCmd"

interface Config extends ExclusiveActionConfig {
	shots?: number
}

interface State {
	shotsTaken: number
}

export default class Commuter extends BasicRolePart<Config, State> implements RemovableAction {
	readonly commands: CommandProperties<RoleCommand>[] = [commuteCmd]
	readonly properties: PartialRoleProperties = {
		investigation: "Commuter",
	}

	constructor(config: Config, state?: State) {
		super(config, state || { shotsTaken: 0 })
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		const { shots } = this.config
		descriptor.name = "Commuter"
		descriptor.addDescription(RoleDescriptor.CATEGORY.ROLE_ABILITIES, {
			name: "Commute",
			description:
				"During the night, you may choose to commute. As a result of this, all actions towards you will fail",
			notes: shots ? ["You have " + (shots === 1 ? "1 shot" : `${shots} shots`)] : [],
		})
	}

	routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_NIGHT: true,
		ALLOW_DEAD: false,
	}

	override async onRoutines(player: Player): Promise<void> {
		if (this.config.shots && this.state.shotsTaken > this.config.shots) {
			return
		}
		const game = player.getGame()
		const cmdPrefix = game.config["command-prefix"]
		await game.sendPeriodPin(
			player.getPrivateChannel(),
			`:camping: You may commute tonight.\n\nUse \`${cmdPrefix}commute on\` or \`${cmdPrefix}commute off\` to decide your action`
		)
	}

	getExistingAction(from: Player): Actionable<unknown> | null {
		return from.getGame().actions.find((action) => action.identifier === "commuter/commute")
	}

	async deselectExistingAction(from: Player, message: Message): Promise<void> {
		if (this.getExistingAction(from)) {
			from.getGame().actions.delete((action) => action.identifier === "commuter/commute")
			await sendDefaultDeselectMessage(":camping:", "commute", from, message)
		}
	}
}
