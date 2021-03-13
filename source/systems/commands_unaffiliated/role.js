var auxils = require("../auxils.js")
var role_info = require("../roles.js")
var flavours = require("../flavours.js")

var win_conditions = require("../win_conditions.js")

var Discord = require("discord.js")

module.exports = async function (message, params, config) {
	// Categorise

	var ret = new Object()

	for (var key in role_info) {
		if (config["playing"]["expansions"].includes("the-butterfly-effect")) {
			var setup = [
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

			if (!setup.includes(key)) {
				continue
			}
		}

		var role = role_info[key]
		var info = role.role

		if (!ret[info.alignment]) {
			ret[info.alignment] = new Object()
		}

		if (!ret[info.alignment][info.class]) {
			ret[info.alignment][info.class] = new Array()
		}

		ret[info.alignment][info.class].push({ id: key, name: info["role-name"] })
	}

	var guild = message.client.guilds.get(config["server-id"])

	var default_flavour = config["playing"]["flavour"]

	if (!default_flavour) {
		for (var key in flavours) {
			if (flavours[key].info["default-display-flavour"] === true) {
				default_flavour = key
				break
			}
		}
	}

	var flavour_identifier = process.timer && process.timer.game ? process.timer.game.flavour_identifier : default_flavour

	if (params.length < 1) {
		var sendable = new String()

		for (var alignment in ret) {
			sendable += "\n\n[" + cpl(alignment) + "]"

			for (var category in ret[alignment]) {
				if (flavour_identifier) {
					var role_names = ret[alignment][category].map((x) => {
						var role = flavours[flavour_identifier]["roles"][x.id]

						if (!role) {
							return x.name
						}

						return role.map((x) => x.name).join("/")
					})
				} else {
					var role_names = ret[alignment][category].map((x) => x.name)
				}

				sendable += "\n" + cpl(category) + ": " + role_names.join(", ")
			}
		}

		if (config["playing"]["expansions"].includes("the-butterfly-effect")) {
			var msg =
				"Setup Info:\n```ini\n[town]\nCitizen, Bulletproof, Neighbour, Lazy Tracker, Tracker, Watcher, Vanilla Cop, Role Cop, Roleblocker, Jailkeeper, Messenger\n\n[mafia team 1]\nBulletproof, Alignment Cop\n\n[mafia team 2]\nBulletproof, Alignment Cop\n\n[recruitable]\nCitizen, Bulletproof, Neighbour, Lazy Tracker, Tracker, Watcher, Vanilla Cop, Role Cop, Roleblocker, Jailkeeper, Messenger\n\n[evil]\nPatient Zero\n\n[27 roles loaded]\n```\n:exclamation: To get more information on a particular role, enter `" +
				config["command-prefix"] +
				"role [info/desc/card] <role>`."

			message.channel.send(msg)
			return null
		} else {
			sendable += "\n\n[" + Object.keys(role_info).length + " roles loaded]"

			sendable =
				"```ini" +
				sendable +
				"```\n:exclamation: To get more information on a particular role, enter `" +
				config["command-prefix"] +
				"role [info/desc/card] <role name>`."

			if (sendable.length < 2000) {
				message.channel.send(sendable)
			} else {
				var channel1 = guild.channels.find((x) => x.name === config["channels"]["roles"])
				message.channel.send(
					":information_source:  The role list length exceeds the characted limit. Refer to the role list provided in " +
						channel1.toString() +
						" instead."
				)
			}

			return null
		}
	}

	var roles = new Array()
	for (var key in role_info) {
		if (config["playing"]["expansions"].includes("the-butterfly-effect")) {
			var setup = [
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

			if (!setup.includes(key)) {
				continue
			}
		}

		var role = role_info[key]

		if (flavour_identifier && flavours[flavour_identifier]["roles"][key]) {
			var flavour_role = flavours[flavour_identifier]["roles"][key]

			for (var i = 0; i < flavour_role.length; i++) {
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

	var action = (params[0] || "").toLowerCase()

	if (!["info", "desc", "card"].includes(action)) {
		// Syntax error
		action = "desc"
		var selected = params.splice(0, Infinity).join(" ")
	} else {
		var selected = params.splice(1, Infinity).join(" ")
	}

	var distances = new Array()
	for (var i = 0; i < roles.length; i++) {
		var distance = auxils.hybridisedStringComparison(selected.toLowerCase(), roles[i].name.toLowerCase())
		distances.push(distance)
	}

	var best_match_index = distances.indexOf(Math.max(...distances))

	var score = distances[best_match_index]

	if (score < 0.7) {
		await message.channel.send(":x: I cannot find that role!")
		return null
	}

	var role = roles[best_match_index]

	if (["info"].includes(action)) {
		var standard_role = role.role

		var embed = new Discord.RichEmbed()

		embed.setColor("BLUE")
		embed.setTitle(role.name)
		embed.setDescription("*" + cpl(standard_role.role.alignment) + "-" + cpl(standard_role.role.class) + "*")

		// Add role information
		//embed.addBlankField();

		var def_stats = ["None", "Basic", "Powerful", "Immune", "Absolute"]
		var kidnap_stats = ["None", "Basic", "Unstoppable"]
		var cardinal = ["No", "Yes", "Yes (special)", "No (special)"]

		embed.addField("General Priority", standard_role.role.stats["priority"], true)
		embed.addField("Defense", def_stats[standard_role.role.stats["basic-defense"]], true)
		embed.addField("Roleblock Immunity", cardinal[standard_role.role.stats["roleblock-immunity"]], true)
		embed.addField("Detection Immunity", cardinal[standard_role.role.stats["detection-immunity"]], true)
		embed.addField("Control Immunity", cardinal[standard_role.role.stats["control-immunity"]], true)
		embed.addField("Redirection Immunity", cardinal[standard_role.role.stats["redirection-immunity"]], true)
		embed.addField("Kidnap Immunity", kidnap_stats[standard_role.role.stats["kidnap-immunity"]], true)
		embed.addField("Vote Magnitude", standard_role.role.stats["vote-magnitude"], true)

		var info_display = role.flavour && !flavours[flavour_identifier]["info"]["display-standard-role-details"]

		if (standard_role.info && !info_display) {
			var info = standard_role.info

			var cond1 = standard_role.abilities && info.abilities.length > 0
			var cond2 = standard_role.attributes && info.attributes.length > 0

			if (cond1 || cond2) {
				embed.addBlankField()
			}

			if (cond1) {
				embed.addField("Abilities", info.abilities.map((x) => "- " + x).join("\n"))
			}

			if (cond2) {
				embed.addField("Attributes", info.attributes.map((x) => "- " + x).join("\n"))
			}

			if (cond1 || cond2) {
				embed.addBlankField()
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
		return null
	} else if (["desc"].includes(action)) {
		var send = ":pencil: Description for **{;role}**:\n```fix\n{;description}```"

		send = send.replace(new RegExp("{;role}", "g"), role.name)
		send = send.replace(new RegExp("{;description}", "g"), role.description)

		await message.channel.send(send)
		return null
	} else if (["card"].includes(action)) {
		// Return card

		if (!role.role_card) {
			await message.channel.send(":x: That role does not have a role card!")
			return null
		}

		var attachment = new Discord.Attachment(await role.role_card, "role_card.png")
		await message.channel.send(attachment)
		return null
	}
}

function cpl(string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}
