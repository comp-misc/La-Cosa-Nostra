import { Guild, GuildMember } from "discord.js"
import choice from "../../../auxils/choice"
import { CommandProperties, CommandUsageError, UnaffiliatedCommand } from "../../../commands/CommandType"
import { getTimer, hasTimer } from "../../../getTimer"
import MemberMessage from "../../../MemberMessage"

export const formatMessage = (
	message: MemberMessage,
	messages: string[],
	extraReplacements: Record<string, string> = {}
): string => {
	let msg = choice(messages)
	msg = msg.replaceAll("%sender%", "**" + message.member?.displayName + "**")

	for (const key in extraReplacements) {
		const replacement = extraReplacements[key]
		msg = msg.replaceAll(`%${key}%`, replacement)
	}
	return msg
}

export const createSelfCommand = (
	name: string,
	description: string,
	messages: string[],
	aliases?: string[]
): CommandProperties<UnaffiliatedCommand> => ({
	name,
	description,
	aliases,
	usage: `!${name}`,
	command: async (message) => {
		const msg = formatMessage(message, messages)
		await message.channel.send(msg)
	},
})

export const createNameCommand = (
	name: string,
	description: string,
	messages: string[],
	aliases?: string[]
): CommandProperties<UnaffiliatedCommand> => ({
	name,
	description,
	aliases,
	usage: `!${name} <...what>`,
	command: async (message, params) => {
		if (params.length === 0) {
			throw new CommandUsageError()
		}
		const what = params.join(" ")
		const msg = formatMessage(message, messages, {
			name: what,
		})
		await message.channel.send(msg)
	},
})

const getMember = (guild: Guild, name: string): GuildMember | null => {
	if (hasTimer()) {
		const { player, score } = getTimer().game.getPlayerMatch(name)
		if (score >= 0.7) {
			const guildMember = player.getGuildMember()
			if (guildMember) {
				return guildMember
			}
		}
	}
	const member = guild.members.cache.find(
		(member) => member.id === name || member.displayName.toLowerCase() === name.toLowerCase()
	)
	if (member) {
		return member
	}
	return null
}

export const createOtherCommand = (
	name: string,
	description: string,
	messages: string[],
	aliases?: string[]
): CommandProperties<UnaffiliatedCommand> => ({
	name,
	description,
	usage: `!${name} <who>`,
	aliases,
	command: async (message, params) => {
		if (params.length !== 1) {
			throw new CommandUsageError()
		}
		const member = getMember(message.guild, params[0])
		if (member) {
			await message.channel.send(
				formatMessage(message, messages, {
					other: `<@${member.id}>`,
				})
			)
		} else {
			await message.channel.send(
				formatMessage(message, messages, {
					other: params[0],
				})
			)
		}
	},
})
