import { Guild, GuildMember } from "discord.js"
import { LcnConfig, PermissionsConfig } from "../LcnConfig"
import { getTextChannel } from "../MafiaBot"
import { UnaffiliatedCommand } from "./CommandType"
import configModifier from "../systems/game_setters/configModifier"

const createSignupCommand = (command: UnaffiliatedCommand): UnaffiliatedCommand => async (message, params, config) => {
	const channel = getTextChannel("signup-channel")
	if (message.channel.id !== channel.id) {
		await message.reply(`:x: Please use <#${channel.id}>`)
		return
	}
	if (message.member.roles.cache.some((r) => r.name === config.permissions.alive)) {
		await message.reply(":x:  You cannot change your role midgame!")
		return
	}
	return command(message, params, config)
}

const removeRole = (
	roleKey: keyof PermissionsConfig,
	message: string | ((member: GuildMember, config: LcnConfig) => string)
) => async (member: GuildMember, config: LcnConfig) => {
	const channel = getTextChannel("signup-channel")
	const role = member.roles.cache.find((role) => role.name === config.permissions[roleKey])
	if (role) {
		await member.roles.remove(role)
		const msg = typeof message === "function" ? message(member, config) : message
		await channel.send("**" + member.user.tag + "** " + msg)
	}
}

export const addRole = async (
	roleKey: keyof PermissionsConfig,
	member: GuildMember,
	config: LcnConfig
): Promise<void> => {
	const role = member.guild.roles.cache.find((role) => role.name === config.permissions[roleKey])
	if (!role) {
		throw new Error(`No role found with name ${config.permissions[roleKey]}`)
	}
	await member.roles.add(role)
}

export const removeSpectator = removeRole("spectator", "is no longer spectating the game!")
export const removeBackup = removeRole("backup", "is no longer a backup player!")

export const removePlayer = removeRole(
	"pre",
	(member, config) => `is no longer playing the game! ${formatSignedUpPlayers(member.guild, config)}`
)

export const formatSignedUpPlayers = (guild: Guild, config: LcnConfig): string => {
	const signedUpPlayers = guild.members.cache.filter((m) =>
		m.roles.cache.some((roleName) => roleName.name === config.permissions.pre)
	).size
	const modifiedConfig = configModifier(config)
	return `[${signedUpPlayers}/${modifiedConfig.playing.roles?.length}]`
}

export default createSignupCommand
