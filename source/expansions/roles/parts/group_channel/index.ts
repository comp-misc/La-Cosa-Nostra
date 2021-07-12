import { TextChannel } from "discord.js"
import { BasePermsConfig } from "../../../../LcnConfig"
import { BasicRolePart, RoutineProperties } from "../../../../role"
import Game from "../../../../systems/game_templates/Game"
import Player from "../../../../systems/game_templates/Player"

export interface CommunicationConfig {
	/**
	 * What channel name to use. Will not create the channel
	 */
	channelName: string
	phase: "day" | "night"
}

export default abstract class GroupChannel<T extends CommunicationConfig> extends BasicRolePart<T, null> {
	constructor(config: T) {
		super(config, null)
	}

	override onStart(player: Player): Promise<void> {
		const channel = this.getTextChannel(player.getGame())
		if (!player.special_channels.some((ch) => ch.name === this.config.channelName)) {
			player.addSpecialChannel(channel)
		}
		return Promise.resolve()
	}

	routineProperties: RoutineProperties = {
		ALLOW_DAY: true,
		ALLOW_NIGHT: true,
		ALLOW_DEAD: false,
	}

	override async onRoutines(player: Player): Promise<void> {
		const game = player.getGame()
		const { phase } = this.config
		const ableToPost = (game.isNight() && phase === "night") || (game.isDay() && phase === "day")

		if (player.isAlive() && ableToPost) {
			await this.changeChatPerms(player, "post")
		} else {
			await this.changeChatPerms(player, "read")
		}
	}

	override async onDeath(player: Player): Promise<void> {
		await this.changeChatPerms(player, "read")
	}

	private async changeChatPerms(player: Player, key: keyof BasePermsConfig): Promise<void> {
		const channel = this.getTextChannel(player.getGame())

		const member = player.getGuildMember()
		if (member) {
			await channel.createOverwrite(member, player.getGame().config["base-perms"][key])
		}
	}

	getTextChannel(game: Game): TextChannel {
		return game.getChannel(this.config.channelName)
	}
}
