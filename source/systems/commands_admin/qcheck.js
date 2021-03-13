const { PermissionOverwrites, DiscordAPIError } = require("discord.js")
var auxils = require("./../auxils.js")
var Discord = require("discord.js")

module.exports = async function (message, params, game) {
	const alwchannel = message.guild.channels.find((channel) => channel.name === "qcheck")

	var roles = game.players

	if (!message.member.roles.find((r) => r.name === "Host")) {
		message.channel.send(`:x: You don't have sufficient permission to use this command`)
	}

	// checks if channel doesn't exist
	if (!alwchannel) {
		// checks if user has role "Host"
		if (message.member.roles.find((r) => r.name === "Host")) {
			// Logs action
			console.log("Checking channel not found, creating one...")
			// Creates channel with permissions for everyone disabled, but for host enabled
			message.guild.createChannel("qcheck", "text").then((chan) => {
				chan.overwritePermissions(message.guild.roles.find("name", "@everyone"), {
					CREATE_INSTANT_INVITE: false,
					VIEW_CHANNEL: false,
					SEND_MESSAGES: false,
				})

				chan.overwritePermissions(message.guild.roles.find("name", "Host"), {
					VIEW_CHANNEL: true,
					SEND_MESSAGES: true,
				})
			})
		}
	} else {
		// logs
		console.log("Channel exists")

		alwchannel.send(`Roles`)
		for (var i = 0; i < roles.length; i++) {
			if (roles[i].status.alive) {
				// Get display role

				if (roles[i].getStatus("lynch-proof")) {
					displays.push("<@" + roles[i].id + "> (\\✖)")
					continue
				}

				// Get people voting against
				var voting_against = roles[i].votes
				var concat = new Array()

				// Get their display names
				for (var j = 0; j < voting_against.length; j++) {
					// Mapped by IDs
					var player = game.getPlayerByIdentifier(voting_against[j].identifier)
					concat.push(player.getDisplayName())
				}

				const embed = new Discord.RichEmbed()
					.setColor(0xff0000)
					.setDescription(`\n\n **${"<@" + roles[i].id + ">** - __" + roles[i].getDisplayRole(false)}__`)
				alwchannel.send(embed)
			}
		}
	}
}
