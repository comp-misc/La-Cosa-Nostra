import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import {
	BasicDescriptionCategory,
	BasicRolePart,
	PartialRoleProperties,
	RoleDescriptor,
	RoutineProperties,
} from "../../../../role"
import Player from "../../../../systems/game_templates/Player"
import shootCmd from "./shootCmd"

export interface Config {
	killProbability: number
	missProbability: number
	selfInflictProbability: number
	bullets: number
}

export interface State {
	bulletsShot: number
}

export default class Marksman extends BasicRolePart<Config, State> {
	readonly commands: CommandProperties<RoleCommand>[] = [shootCmd]
	readonly properties: PartialRoleProperties = {
		investigation: "Marksman",
	}

	constructor(config: Config, state?: State) {
		super(config, state || { bulletsShot: 0 })
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Marksman"
		descriptor.flavorText =
			"You love guns. A lot. So much, you smuggled your beloved Sten gun MK II past customs and border control."
		descriptor.addDescription(BasicDescriptionCategory.ROLE_ABILITIES, {
			name: "Shoot",
			description: "During the day, you may shoot a player",
			notes: [
				"All players will see this action, including you as the perpetrator",
				"Acts as a regular kill",
				"You have " + (this.config.bullets === 1 ? "1 bullet" : `${this.config.bullets} bullets`),
			],
		})
	}

	override async onRoutines(player: Player): Promise<void> {
		if (this.getBulletsShot() < this.config.bullets) {
			const config = player.getGame().config

			const channel = player.getPrivateChannel()
			await player
				.getGame()
				.sendPeriodPin(
					channel,
					":gun: You may shoot someone today.\n\nUse: `" +
						config["command-prefix"] +
						"shoot <target>` to select your target"
				)
		}
	}

	getBulletsShot(): number {
		return this.state.bulletsShot
	}

	addBulletShot(): void {
		this.state.bulletsShot++
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: true,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}
}
