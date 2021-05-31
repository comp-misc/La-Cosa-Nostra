import { TextChannel } from "discord.js"
import { AdminCommand } from "../CommandType"
import Discord from "discord.js"
import { getTimer, hasTimer } from "../../getTimer"

const qcheck: AdminCommand = async (message) => {
	if (!hasTimer() || !["playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}

	const game = getTimer().game

	const alwchannel = message.guild.channels.cache.find((channel) => channel.name === "qcheck")

	const roles = game.players

	// checks if channel doesn't exist
	if (!alwchannel) {
		// checks if user has role "Host"
		if (message.member.roles.cache.find((r) => r.name === "Host")) {
			// Logs action
			console.log("Checking channel not found, creating one...")
			// Creates channel with permissions for everyone disabled, but for host enabled
			const channel = await message.guild.channels.create("qcheck", { type: "text" })
			await channel.createOverwrite(message.guild.roles.everyone, {
				CREATE_INSTANT_INVITE: false,
				VIEW_CHANNEL: false,
				SEND_MESSAGES: false,
			})

			const host = message.guild.roles.cache.find((r) => r.name === "Host")
			if (host) {
				await channel.createOverwrite(host, {
					VIEW_CHANNEL: true,
					SEND_MESSAGES: true,
				})
			}
		}
		return
	} else if (!(alwchannel instanceof TextChannel)) {
		await message.channel.send(":x: The qcheck channel is not a text channel")
		return
	} else {
		await alwchannel.send(`Roles`)
		const displays: string[] = []
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].status.alive) {
				// Get display role

				if (roles[i].getStatus("lynchProof")) {
					displays.push("<@" + roles[i].id + "> (\\✖)")
					continue
				}

				// Get people voting against
				const voting_against = roles[i].votes
				const concat: string[] = []

				// Get their display names
				for (let j = 0; j < voting_against.length; j++) {
					// Mapped by IDs
					const player = game.getPlayerByIdentifierOrThrow(voting_against[j].identifier)
					concat.push(player.getDisplayName())
				}

				const embed = new Discord.MessageEmbed()
					.setColor(0xff0000)
					.setDescription(`\n\n **${"<@" + roles[i].id + ">** - __" + roles[i].role.getDisplayName()}__`)
				await alwchannel.send(embed)
			}
		}
	}
}

export default qcheck
