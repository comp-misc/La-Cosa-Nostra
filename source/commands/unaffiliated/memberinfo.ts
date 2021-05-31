import Discord from "discord.js"
import getGuild from "../../getGuild"
import auxils from "../../systems/auxils"
import { UnaffiliatedCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const memberinfo: UnaffiliatedCommand = async (message, params, config) => {
	if (params.length < 1) {
		await message.channel.send(
			":x: Wrong syntax! Please use `" +
				config["command-prefix"] +
				'memberinfo <username/nickname/id/"user">` instead!'
		)
		return
	}

	let name = params.join(" ")

	if (name.toLowerCase() === "user") {
		name = message.author.id
	}

	const guild = getGuild(message.client)

	let members = guild.members.cache.array().map((x) => {
		if (x.user.id === name) {
			const score = 2
			return { member: x, score: score }
		}

		const display_name_score = auxils.hybridisedStringComparison(x.displayName, name)
		const username_score = auxils.hybridisedStringComparison(x.user.username, name)

		return { member: x, score: Math.max(display_name_score, username_score) }
	})

	members.sort(function (a, b) {
		return b.score - a.score
	})

	members = members.filter(function (x) {
		return x.score >= 0.7
	})

	if (members.length < 1) {
		await message.channel.send(
			":x: Oi! I can't find a member with that name! Try again using a legitimate username/nickname/id!"
		)
		return
	}

	members = members.filter((x) => x.score >= members[0].score - 0.02)

	for (let i = 0; i < members.length; i++) {
		const embed = new Discord.MessageEmbed()

		const member = members[i].member

		embed.setTitle(member.user.username + "#" + member.user.discriminator)
		embed.setColor(member.displayHexColor)

		if (member.nickname !== null) {
			embed.addField("Nickname", member.nickname)
		}

		const presences = {
			offline: "Offline",
			online: "Online",
			idle: "Idle",
			dnd: "Do Not Disturb",
			invisible: "Invisible",
		}

		if (member.joinedAt) embed.addField("Joined server at", member.joinedAt.toISOString(), true)
		embed.addField("Joined Discord at", member.user.createdAt.toISOString(), true)
		embed.addField("Highest role", member.roles.highest.name, true)
		embed.addField("Status", presences[member.user.presence.status], true)
		embed.setFooter("Discord ID " + member.user.id)

		const avatar = member.user.avatarURL()
		if (avatar) {
			embed.setThumbnail(avatar)
		}

		await message.channel.send(embed)
	}
}

export default makeCommand(memberinfo, {
	name: "memberinfo",
	description: "Shows information about a member",
	usage: "memberinfo <user>",
})
