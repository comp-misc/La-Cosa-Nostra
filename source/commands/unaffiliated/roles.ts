import Discord from "discord.js"
import capitaliseFirstLetter from "../../auxils/capitaliseFirstLetter"
import groupBy from "../../auxils/groupBy"
import hybridisedStringComparison from "../../auxils/hybridisedStringComparison"
import pettyFormat from "../../auxils/pettyFormat"
import { formatAlignment, MergedRole } from "../../role"
import flavours from "../../systems/flavours"
import { UnaffiliatedCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const roles: UnaffiliatedCommand = async (message, params, config) => {
	// Categorise
	if (!config.game["show-roles"]) {
		await message.reply(":placard: Role info may not be checked during this game.")
		return
	}

	const flavour = config.playing.flavour ? flavours[config.playing.flavour] : undefined
	const roles = config.playing.possibleRoles.map((role) => new MergedRole(role, flavour))

	let default_flavour = config.playing.flavour

	if (!default_flavour) {
		for (const key in flavours) {
			if (flavours[key].info["default-display-flavour"] === true) {
				default_flavour = key
				break
			}
		}
	}

	if (params.length == 0) {
		let sendable = ""

		const groupedByAlignment = groupBy(roles, (role) => formatAlignment(role.properties.alignment))
		for (const [alignment, roles] of Object.entries(groupedByAlignment)) {
			sendable +=
				"\n\n[" +
				capitaliseFirstLetter(alignment) +
				"]\n" +
				roles.map((role) => role.getDisplayName(true)).join(", ")
		}

		sendable += `\n\n[${roles.length} roles loaded]`

		sendable =
			"```ini" +
			sendable +
			"```\n:exclamation: To get more information on a particular role, enter `" +
			config["command-prefix"] +
			"role [info/desc/card] <role name>`."

		await message.channel.send(sendable)
		return
	}

	let action = (params[0] || "").toLowerCase()

	let selected: string
	if (!["info", "desc", "card"].includes(action)) {
		// Syntax error
		action = "desc"
		selected = params.splice(0, Infinity).join(" ")
	} else {
		selected = params.splice(1, Infinity).join(" ")
	}

	const distances = roles.map((role) => hybridisedStringComparison(selected.toLowerCase(), role.getDeathName()))

	const best_match_index = distances.indexOf(Math.max(...distances))

	const score = distances[best_match_index]

	if (score < 0.7) {
		await message.channel.send(":x: I cannot find that role!")
		return
	}

	const role = roles[best_match_index]
	for (const part of role.allParts) {
		await part.onRoleStart(role)
	}

	if (["info"].includes(action)) {
		const embed = new Discord.MessageEmbed()

		embed.setColor("BLUE")
		embed.setTitle(role.getDeathName())
		embed.setDescription("*" + formatAlignment(role.properties.alignment) + "*")

		// Add role information
		//embed.addBlankField();

		const def_stats = ["None", "Basic", "Powerful", "Immune", "Absolute"]
		const kidnap_stats = ["None", "Basic", "Unstoppable"]
		const cardinal = ["No", "Yes", "Yes (special)", "No (special)"]

		const stats = role.properties.stats
		embed.addField("Defense", def_stats[stats["basic-defense"]], true)
		embed.addField("Roleblock Immunity", cardinal[stats["roleblock-immunity"]], true)
		embed.addField("Detection Immunity", cardinal[stats["detection-immunity"]], true)
		embed.addField("Control Immunity", cardinal[stats["control-immunity"]], true)
		embed.addField("Redirection Immunity", cardinal[stats["redirection-immunity"]], true)
		embed.addField("Kidnap Immunity", kidnap_stats[stats["kidnap-immunity"]], true)
		embed.addField("Vote Magnitude", stats["vote-magnitude"], true)

		const info = role.properties
		if (info.credits) {
			embed.setFooter("Role by: " + pettyFormat(info.credits))
		}

		embed.addField("Win Condition", role.winCondition.DESCRIPTION, false)

		await message.channel.send(embed)
		return
	} else if (["desc"].includes(action)) {
		let send = ":pencil: Description for **{;role}**:\n{;description}"

		send = send.replace(new RegExp("{;role}", "g"), role.getDeathName())
		send = send.replace(new RegExp("{;description}", "g"), role.getDescription(config.messages.name))

		await message.channel.send(send)
		return
	} else if (["card"].includes(action)) {
		// Return card
		const attachment = new Discord.MessageAttachment(await role.createRoleCard(), "role_card.png")
		await message.channel.send(attachment)
		return
	}
}

export default makeCommand(roles, {
	name: "roles",
	description: "Shows information about a role",
	usage: "!role [info | desc | card] <role>",
	aliases: ["role"],
})
