import pettyFormat from "./pettyFormat"
import formatDateVerbose from "./formatDateVerbose"
import formatUTCDate from "./formatUTCDate"
import levenshteinDistance from "./levenshteinDistance"
import { Client, Snowflake, TextChannel } from "discord.js"
import { getTimer, hasTimer } from "../getTimer"
import { ChannelsConfig, LcnConfig, PermissionsConfig } from "../LcnConfig"
import getGuild from "../getGuild"
import { onWithError } from "../MafiaBot"

interface PingRestriction {
	author: Snowflake
	date: Date
}

const ping_restrictions: PingRestriction[] = []

export default (client: Client, config: LcnConfig): void => {
	const getChannel = (channel: keyof ChannelsConfig): TextChannel => {
		const ch = getGuild(client).channels.cache.find((x) => x.name === config.channels[channel])
		if (!ch) {
			throw new Error(`Unknown channel '${channel}'`)
		}
		if (!(ch instanceof TextChannel)) {
			throw new Error(`Channel ${ch.name} is not a Text Channel`)
		}
		return ch
	}
	onWithError("message", async (message) => {
		if (hasTimer() && getTimer().game) {
			await getTimer().game.execute("chat", { message: message })
		}
	})

	onWithError("message", async (message) => {
		if (!hasTimer() || !getTimer().game || getTimer().game.state !== "playing" || !message.member) {
			return
		}

		if (message.id === client.user?.id) {
			return
		}

		// Ping restrictions
		const ping_config = config["message-checks"]["alive-pings"]

		if (!ping_config.restrict) {
			return
		}

		const guild = getGuild(client)
		const main_channel = getChannel("main")
		const whisper_channel = getChannel("whisper-log")

		const alive_role = await getTimer().game.getDiscordRoleOrThrow("alive")

		if (message.channel.id !== main_channel.id && message.channel.id !== whisper_channel.id) {
			return
		}

		if (!message.mentions.has(alive_role)) {
			return
		}

		for (let i = 0; i < ping_config.exempt.length; i++) {
			const role_key: string = ping_config.exempt[i]

			const exempt_role = guild.roles.cache.find(
				(x) => x.name === config.permissions[role_key as keyof PermissionsConfig]
			)

			if (exempt_role && message.member.roles.cache.some((x) => x.id === exempt_role.id)) {
				return
			}
		}

		const current = message.createdAt
		let count = 0

		ping_restrictions.push({ author: message.author.id, date: current })

		for (let i = ping_restrictions.length - 1; i >= 0; i--) {
			if (ping_restrictions[i].author !== message.author.id) {
				continue
			}

			const delta = current.getTime() - ping_restrictions[i].date.getTime()

			if (delta > ping_config["threshold-time"]) {
				ping_restrictions.splice(i, 1)
			} else {
				count++
			}
		}

		if (count > ping_config.threshold) {
			await message.channel.send(
				`:x: <@${message.author.id}>, please refrain from pinging the Alive role more than __${
					ping_config.threshold
				}__ time${pettyFormat([
					"s",
					ping_config.threshold.toString(),
				])} in the timespan of **${formatDateVerbose(ping_config["threshold-time"])}**!`
			)
		}
	})

	onWithError("messageUpdate", async (old_message, new_message) => {
		if (!hasTimer() || getTimer().game.state !== "playing" || !new_message.member) {
			return
		}

		if (new_message.id === client.user?.id) {
			return
		}

		const edit_config = config["message-checks"].edits

		if (!edit_config.restrict) {
			return
		}

		const guild = getGuild(client)
		const main_channel = getChannel("main")
		const whisper_channel = getChannel("whisper-log")

		if (new_message.channel.id !== main_channel.id && new_message.channel.id !== whisper_channel.id) {
			return
		}

		for (let i = 0; i < edit_config.exempt.length; i++) {
			const role_key: string = edit_config.exempt[i]

			const exempt_role = guild.roles.cache.find(
				(x) => x.name === config.permissions[role_key as keyof PermissionsConfig]
			)

			if (exempt_role && new_message.member.roles.cache.some((x) => x.id === exempt_role.id)) {
				return
			}
		}

		if (
			!old_message.content ||
			!new_message.content ||
			!new_message.author ||
			old_message.content.length < edit_config["minimum-character-count"]
		) {
			return
		}

		// Check for message differences using Levenshtein distance
		const delta = levenshteinDistance(old_message.content, new_message.content)

		if (delta / edit_config["minimum-character-count"] >= edit_config["edit-ratio"]) {
			const edit_delta = new Date().getTime() - (old_message.editedAt || old_message.createdAt).getTime()

			await new_message.channel.send(
				`:x: <@${new_message.author.id}>, you edited message ${new_message.id} [__${
					old_message.content.length
				}__ character${pettyFormat(["s", old_message.content.length.toString()])} → __${
					new_message.content.length
				}__ character${pettyFormat(["s", new_message.content.length.toString()])}] by __${Math.round(
					(delta * 100) / old_message.content.length
				)}%__ in the timespan of **${formatDateVerbose(
					edit_delta
				)}**. Please do not change the context of messages if they pertain to the game!`
			)
		}
	})

	onWithError("messageDelete", async (message) => {
		if (!hasTimer() || getTimer().game.state !== "playing" || !message.member) {
			return
		}

		if (message.id === client.user?.id) {
			return
		}

		// Ping restrictions
		const deletion_config = config["message-checks"].deletion

		if (!deletion_config.restrict) {
			return
		}

		const guild = getGuild(client)
		const main_channel = getChannel("main")
		const whisper_channel = getChannel("whisper-log")

		if (
			!message.content ||
			!message.author ||
			(message.channel.id !== main_channel.id && message.channel.id !== whisper_channel.id)
		) {
			return
		}

		for (const role_key of deletion_config.exempt) {
			const exempt_role = guild.roles.cache.find(
				(x) => x.name === config.permissions[role_key as keyof PermissionsConfig]
			)

			if (exempt_role && message.member.roles.cache.some((x) => x.id === exempt_role.id)) {
				return
			}
		}

		const length = message.content.length

		if (length >= deletion_config["minimum-character-count"]) {
			await message.channel.send(
				`:x: <@${message.author.id}>, you deleted message ${message.id} [${length} character${pettyFormat([
					"s",
					length.toString(),
				])}] posted on **${formatUTCDate(
					message.createdAt
				)}**. Please do not delete messages if they pertain to the game!`
			)
		}
	})
}
