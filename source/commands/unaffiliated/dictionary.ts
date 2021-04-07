import { UnaffiliatedCommand } from "../CommandType"

import Discord from "discord.js"

import terminology from "../../terminology.json"

const capFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

const terms: Record<string, TerminologyEntry> = terminology

interface TerminologyEntry {
	term?: string
	description?: string
	example?: string
}

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

	const match = Object.entries(terms).find(([key]) => key.toLowerCase() === search.toLowerCase())

	if (!match) {
		await message.channel.send(
			":x: I cannot find that term! Enter `" + config["command-prefix"] + "dictionary` for a list of them."
		)
		return
	}
	const [key, info] = match

	// Create embed
	const embed = new Discord.MessageEmbed()
	embed.setColor("RED")
	embed.setTitle("Lookup for term: **" + key + "**")

	Object.entries(info).forEach(([name, value]) => {
		embed.addField(capFirstLetter(name), value, false)
	})

	await message.channel.send(embed)
}

export = dictionary
