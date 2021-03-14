import { UnaffiliatedCommand } from "../CommandType"

import Discord from "discord.js"

import terms from "../../terminology.json"

const capFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

const keys = Object.keys(terms).sort()
const dictionary: UnaffiliatedCommand = async (message, params, config) => {
	if (params.length < 1) {
		const embed = new Discord.MessageEmbed()

		embed.setColor("RED")
		embed.setTitle("Available lookup terms")
		embed.setDescription(keys.join(", "))

		await message.channel.send(embed)

		return
	}

	const search = params.join(" ")

	let ret = undefined
	let key: string | undefined = undefined

	Object.entries(terms)
		.filter(([key]) => key.toLowerCase() === search.toLowerCase())
		.forEach(([k, term]) => {
			ret = term
			key = k
		})

	if (!ret) {
		await message.channel.send(
			":x: I cannot find that term! Enter `" + config["command-prefix"] + "dictionary` for a list of them."
		)
		return
	}

	// Create embed
	const embed = new Discord.MessageEmbed()
	embed.setColor("RED")
	embed.setTitle("Lookup for term: **" + key + "**")

	const definitions = Object.keys(ret)

	for (let i = 0; i < definitions.length; i++) {
		if (i > 0) {
			embed.addField("", "")
		}

		embed.addField(capFirstLetter(definitions[i]), ret[definitions[i]], false)
	}

	await message.channel.send(embed)
}

export = dictionary
