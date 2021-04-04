import Discord from "discord.js"
import capitaliseFirstLetter from "../../auxils/capitaliseFirstLetter"
import getGuild from "../../getGuild"
import { getTimer, hasTimer } from "../../getTimer"
import auxils from "../../systems/auxils"
import { UnaffiliatedCommand } from "../CommandType"
import flavours from "../../systems/flavours"
import role_info from "../../systems/roles"
import win_conditions from "../../systems/win_conditions"
import makeCommand from "../makeCommand"

const butterflyEffectSetup = [
	"town_citizen",
	"recruitable_citizen",
	"town_bulletproof",
	"recruitable_bulletproof",
	"mafia_team_1_bulletproof",
	"mafia_team_2_bulletproof",
	"town_neighbour",
	"recruitable_neighbour",
	"town_lazy_tracker",
	"recruitable_lazy_tracker",
	"town_tracker",
	"recruitable_tracker",
	"town_watcher",
	"recruitable_watcher",
	"town_vanilla_cop",
	"recruitable_vanilla_cop",
	"town_role_cop",
	"recruitable_role_cop",
	"mafia_team_1_alignment_cop",
	"mafia_team_2_alignment_cop",
	"town_messenger",
	"recruitable_messenger",
	"town_roleblocker",
	"recruitable_roleblocker",
	"town_jailkeeper",
	"recruitable_jailkeeper",
	"patient_zero",
]

const role: UnaffiliatedCommand = async (message, params, config) => {
	// Categorise
	if (!config.game["show-roles"]) {
		await message.reply(":placard: Role info may not be checked during this game.")
		return
	}
	const ret: Record<string, Record<string, { id: string; name: string }[]>> = {}

	for (const key in role_info) {
		if (config.playing.expansions.includes("the-butterfly-effect")) {
			if (!butterflyEffectSetup.includes(key)) {
				continue
			}
		}

		const role = role_info[key]
		const info = role.role

		if (!ret[info.alignment]) {
			ret[info.alignment] = {}
		}

		if (!ret[info.alignment][info.class]) {
			ret[info.alignment][info.class] = []
		}

		ret[info.alignment][info.class].push({ id: key, name: info["role-name"] })
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
						const role = flavours[flavour_identifier]["roles"][x.id]

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
		} else {
			sendable += "\n\n[" + Object.keys(role_info).length + " roles loaded]"

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
					":information_source:  The role list length exceeds the characted limit. Refer to the role list provided in " +
						channel1?.toString() +
						" instead."
				)
			}

			return
		}
	}

	const roles = []
	for (const key in role_info) {
		if (config.playing.expansions.includes("the-butterfly-effect")) {
			if (!butterflyEffectSetup.includes(key)) {
				continue
			}
		}

		const role = role_info[key]

		if (flavour_identifier && flavours[flavour_identifier]["roles"][key]) {
			const flavour_role = flavours[flavour_identifier]["roles"][key]

			for (let i = 0; i < flavour_role.length; i++) {
				roles.push({
					role_identifier: key,
					name: flavour_role[i].name || role.role["role-name"],
					description: flavour_role[i].description || role.description,
					role_card: flavours[flavour_identifier].assets[flavour_role[i].banner] || role.role_card,
					flavour: true,
					role: role,
				})
			}

			continue
		}

		roles.push({
			role_identifier: key,
			name: role.role["role-name"],
			description: role.description,
			flavour: false,
			role_card: role.role_card,
			role: role,
		})
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

	const distances = []
	for (let i = 0; i < roles.length; i++) {
		const distance = auxils.hybridisedStringComparison(selected.toLowerCase(), roles[i].name.toLowerCase())
		distances.push(distance)
	}

	const best_match_index = distances.indexOf(Math.max(...distances))

	const score = distances[best_match_index]

	if (score < 0.7) {
		await message.channel.send(":x: I cannot find that role!")
		return
	}

	const role = roles[best_match_index]

	if (["info"].includes(action)) {
		const standard_role = role.role

		const embed = new Discord.MessageEmbed()

		embed.setColor("BLUE")
		embed.setTitle(role.name)
		embed.setDescription(
			"*" +
				capitaliseFirstLetter(standard_role.role.alignment) +
				"-" +
				capitaliseFirstLetter(standard_role.role.class) +
				"*"
		)

		// Add role information
		//embed.addBlankField();

		const def_stats = ["None", "Basic", "Powerful", "Immune", "Absolute"]
		const kidnap_stats = ["None", "Basic", "Unstoppable"]
		const cardinal = ["No", "Yes", "Yes (special)", "No (special)"]

		embed.addField("General Priority", standard_role.role.stats.priority, true)
		embed.addField("Defense", def_stats[standard_role.role.stats["basic-defense"]], true)
		embed.addField("Roleblock Immunity", cardinal[standard_role.role.stats["roleblock-immunity"]], true)
		embed.addField("Detection Immunity", cardinal[standard_role.role.stats["detection-immunity"]], true)
		embed.addField("Control Immunity", cardinal[standard_role.role.stats["control-immunity"]], true)
		embed.addField("Redirection Immunity", cardinal[standard_role.role.stats["redirection-immunity"]], true)
		embed.addField("Kidnap Immunity", kidnap_stats[standard_role.role.stats["kidnap-immunity"]], true)
		embed.addField("Vote Magnitude", standard_role.role.stats["vote-magnitude"], true)

		const flavour = flavours[flavour_identifier || ""]
		if (!flavour) {
			throw new Error("No flavour")
		}
		const info_display = role.flavour && !flavour.info["display-standard-role-details"]

		if (standard_role.info && !info_display) {
			const info = standard_role.info

			const cond1 = info.abilities.length > 0
			const cond2 = info.attributes.length > 0

			if (cond1) {
				embed.addField("Abilities", info.abilities.map((x) => "- " + x).join("\n"))
			}

			if (cond2) {
				embed.addField("Attributes", info.attributes.map((x) => "- " + x).join("\n"))
			}

			if (info.thumbnail) {
				embed.setThumbnail(info.thumbnail)
			}

			if (info.credits) {
				embed.setFooter("Role by: " + auxils.pettyFormat(info.credits))
			}
		}

		if (
			win_conditions[standard_role.role["win-condition"]] &&
			win_conditions[standard_role.role["win-condition"]].DESCRIPTION
		) {
			embed.addField("Win Condition", win_conditions[standard_role.role["win-condition"]].DESCRIPTION, false)
		}

		await message.channel.send(embed)
		return
	} else if (["desc"].includes(action)) {
		let send = ":pencil: Description for **{;role}**:\n```fix\n{;description}```"

		send = send.replace(new RegExp("{;role}", "g"), role.name)
		send = send.replace(new RegExp("{;description}", "g"), role.description)

		await message.channel.send(send)
		return
	} else if (["card"].includes(action)) {
		// Return card

		if (!role.role_card) {
			await message.channel.send(":x: That role does not have a role card!")
			return
		}

		const attachment = new Discord.MessageAttachment(await role.role_card, "role_card.png")
		await message.channel.send(attachment)
		return
	}
}

export default makeCommand(role, {
	name: "role",
	description: "Shows information about a role",
	usage: "!role [info | desc | card] <role>",
})
