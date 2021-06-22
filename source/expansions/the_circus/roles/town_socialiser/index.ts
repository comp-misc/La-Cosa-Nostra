import { PermissionObject, TextChannel } from "discord.js"
import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import getLogger from "../../../../getLogger"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"
import { ProgrammableRole, RoleProperties, RoutineProperties } from "../../../../systems/Role"
import roleProperties from "./role.json"
import inviteCmd from "./commands/invite"
import Game from "../../../../systems/game_templates/Game"

const DESCRIPTION = `
Welcome to \${game.name}! You are a Town Socialiser

Role Abilities:
- Each night, you may attempt to invite a player to the party, adding them to a shared night chat the following day.
  Only certain types of players will accept your invitation
  Attempting to invite Mafia will result in your death

Win Condition: You win when all threats to town have been eliminated and there is at least one member of town left.
`.trim()

export default class TownSocialiser implements ProgrammableRole<null> {
	readonly config = null
	readonly properties: RoleProperties = roleProperties
	readonly commands: CommandProperties<RoleCommand>[] = [inviteCmd]

	getDescription(): string {
		return DESCRIPTION
	}

	async onStart(player: Player): Promise<void> {
		await player.getGame().addAction("town_socialiser/roleblocked", ["roleblock"], {
			from: player,
			to: player,
			expiry: Infinity,
			tags: ["permanent"],
			priority: ActionPriorities.HIGH,
		})

		const game = player.getGame()
		const channel = await game.createPrivateChannel("party", [])
		game.setChannel("primary", channel)

		await this.addPlayerToParty(player, false)
	}

	async addPlayerToParty(player: Player, showMessage = true): Promise<void> {
		const game = player.getGame()
		const channel = this.getPartyChannel(game)

		player.addSpecialChannel(channel)

		const member = player.getGuildMember()
		if (member) {
			const readPerms = game.config["base-perms"].read
			await channel.createOverwrite(member, readPerms)
		} else {
			getLogger().log(2, `No discord user for ${player.getDisplayName()} - can't set permissions party channel`)
		}
		if (showMessage) {
			await game.sendPin(channel, ":tada: <@" + player.id + "> has been added to the party!")
		}
	}

	async onRoutines(player: Player): Promise<void> {
		const game = player.getGame()
		const channel = this.getPartyChannel(game)
		const playersInChannel = player
			.getGame()
			.findAllPlayers((p) => p.isAlive() && p.special_channels.some((ch) => ch.id === channel.id))

		let channelPerms: PermissionObject
		if (player.getGame().isDay()) {
			channelPerms = game.config["base-perms"].read
		} else {
			channelPerms = game.config["base-perms"].post
		}
		for (const p of playersInChannel) {
			const member = p.getGuildMember()
			if (member) {
				await channel.createOverwrite(member, channelPerms)
			}
		}
		if (player.isAlive() && !game.isDay()) {
			await game.sendPeriodPin(
				player.getPrivateChannel(),
				":tada: You may invite someone to the party tonight\n\n" + inviteCmd.formatUsageDescription(game.config)
			)
		}
	}

	getPartyChannel(game: Game): TextChannel {
		const data = game.channels.party
		if (!data) {
			throw new Error("Party channel not defined")
		}
		const channel = game.getChannelById(data.id)
		if (!channel) {
			throw new Error("Party channel not found")
		}
		return channel
	}

	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: true,
		ALLOW_DEAD: true,
		ALLOW_NIGHT: true,
	}
}
