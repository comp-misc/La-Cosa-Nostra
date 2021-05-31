import Discord from "discord.js"
import capitaliseFirstLetter from "../../auxils/capitaliseFirstLetter"
import hybridisedStringComparison from "../../auxils/hybridisedStringComparison"
import pettyFormat from "../../auxils/pettyFormat"
import getGuild from "../../getGuild"
import { getTimer, hasTimer } from "../../getTimer"
import flavours from "../../systems/flavours"
import FlavourRole from "../../systems/game_templates/FlavourRole"
import role_info from "../../systems/roles"
import win_conditions from "../../systems/win_conditions"
import { UnaffiliatedCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const roles: UnaffiliatedCommand = async (message, params, config) => {
	// Categorise
	if (!config.game["show-roles"]) {
		await message.reply(":placard: Role info may not be checked during this game.")
		return
	}
	const ret: Record<string, Record<string, { id: string; name: string }[]>> = {}

	const flavour = config.playing.flavour ? flavours[config.playing.flavour] : undefined
	const roles = config.playing.possibleRoles.map((role) => new FlavourRole(role, config, flavour))

	for (const role of roles) {
		const properties = role.properties
		if (!ret[properties.alignment]) {
			ret[properties.alignment] = {}
		}

		if (!ret[properties.alignment][properties.class]) {
			ret[properties.alignment][properties.class] = []
		}

		ret[properties.alignment][properties.class].push({ id: role.identifier, name: role.getDisplayName() })
	}

	const guild = getGuild(message.client)

	let default_flavour = config.playing.flavour

	if (!default_flavour) {
		for (const key in flavours) {
			if (flavours[key].info["default-display-flavour"] === true) {
				default_flavour = key
				break
			}
		}
	}

	const flavour_identifier = hasTimer() ? getTimer().game.flavour_identifier : default_flavour

	if (params.length < 1) {
		let sendable = ""

		for (const alignment in ret) {
			sendable += "\n\n[" + capitaliseFirstLetter(alignment) + "]"

			for (const category in ret[alignment]) {
				let role_names: string[]
				if (flavour_identifier) {
					role_names = ret[alignment][category].map((x) => {
						const role = flavours[flavour_identifier].roles[x.id]

						if (!role) {
							return x.name
						}

						return role.map((x) => x.name).join("/")
					})
				} else {
					role_names = ret[alignment][category].map((x) => x.name)
				}

				sendable += "\n" + capitaliseFirstLetter(category) + ": " + role_names.join(", ")
			}
		}

		if (config.playing.expansions.includes("the-butterfly-effect")) {
			const msg =
				"Setup Info:\n```ini\n[town]\nCitizen, Bulletproof, Neighbour, Lazy Tracker, Tracker, Watcher, Vanilla Cop, Role Cop, Roleblocker, Jailkeeper, Messenger\n\n[mafia team 1]\nBulletproof, Alignment Cop\n\n[mafia team 2]\nBulletproof, Alignment Cop\n\n[recruitable]\nCitizen, Bulletproof, Neighbour, Lazy Tracker, Tracker, Watcher, Vanilla Cop, Role Cop, Roleblocker, Jailkeeper, Messenger\n\n[evil]\nPatient Zero\n\n[27 roles loaded]\n```\n:exclamation: To get more information on a particular role, enter `" +
				config["command-prefix"] +
				"role [info/desc/card] <role>`."

			await message.channel.send(msg)
			return
		}

		sendable += "\n\n[" + Object.keys(role_info).length.toString() + " roles loaded]"

		sendable =
			"```ini" +
			sendable +
			"```\n:exclamation: To get more information on a particular role, enter `" +
			config["command-prefix"] +
			"role [info/desc/card] <role name>`."

		if (sendable.length < 2000) {
			await message.channel.send(sendable)
		} else {
			const channel1 = guild.channels.cache.find((x) => x.name === config.channels.roles)
			await message.channel.send(
				":information_source:  The role list length exceeds the character limit. Refer to the role list provided in " +
					(channel1 || "undefined").toString() +
					" instead."
			)
		}
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

	const distances = roles.map((role) => hybridisedStringComparison(selected.toLowerCase(), role.getDisplayName()))

	const best_match_index = distances.indexOf(Math.max(...distances))

	const score = distances[best_match_index]

	if (score < 0.7) {
		await message.channel.send(":x: I cannot find that role!")
		return
	}

	const role = roles[best_match_index]

	if (["info"].includes(action)) {
		const embed = new Discord.MessageEmbed()

		embed.setColor("BLUE")
		embed.setTitle(role.getDisplayName())
		embed.setDescription(
			"*" +
				capitaliseFirstLetter(role.properties.alignment) +
				"-" +
				capitaliseFirstLetter(role.properties.class) +
				"*"
		)

		// Add role information
		//embed.addBlankField();

		const def_stats = ["None", "Basic", "Powerful", "Immune", "Absolute"]
		const kidnap_stats = ["None", "Basic", "Unstoppable"]
		const cardinal = ["No", "Yes", "Yes (special)", "No (special)"]

		embed.addField("Defense", def_stats[role.stats["basic-defense"]], true)
		embed.addField("Roleblock Immunity", cardinal[role.stats["roleblock-immunity"]], true)
		embed.addField("Detection Immunity", cardinal[role.stats["detection-immunity"]], true)
		embed.addField("Control Immunity", cardinal[role.stats["control-immunity"]], true)
		embed.addField("Redirection Immunity", cardinal[role.stats["redirection-immunity"]], true)
		embed.addField("Kidnap Immunity", kidnap_stats[role.stats["kidnap-immunity"]], true)
		embed.addField("Vote Magnitude", role.stats["vote-magnitude"], true)

		const info = role.properties
		if (info.abilities && info.abilities.length > 0) {
			embed.addField("Abilities", info.abilities.map((x) => "- " + x).join("\n"))
		}

		if (info.attributes && info.attributes.length > 0) {
			embed.addField("Attributes", info.attributes.map((x) => "- " + x).join("\n"))
		}

		if (info.thumbnail) {
			embed.setThumbnail(info.thumbnail)
		}

		if (info.credits) {
			embed.setFooter("Role by: " + pettyFormat(info.credits))
		}

		if (win_conditions[info["win-condition"]] && win_conditions[info["win-condition"]].DESCRIPTION) {
			embed.addField("Win Condition", win_conditions[info["win-condition"]].DESCRIPTION, false)
		}

		await message.channel.send(embed)
		return
	} else if (["desc"].includes(action)) {
		let send = ":pencil: Description for **{;role}**:\n```fix\n{;description}```"

		send = send.replace(new RegExp("{;role}", "g"), role.getDisplayName())
		send = send.replace(new RegExp("{;description}", "g"), role.description)

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
