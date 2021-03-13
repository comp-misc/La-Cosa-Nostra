var expansion_config = require("../../miscellaneous/config")

module.exports = async function (message) {
	var guild = message.client.guilds.get(process.env["server-id"])

	// Purges all consipracy channels
	var categories = guild.channels
		.filter((x) => x.name.startsWith(expansion_config["cc-category-prefix"]) && x.type === "category")
		.array()

	let channels = []

	for (let i = 0; i < categories.length; i++) {
		channels = channels.concat(categories[i].children.array())
	}

	channels = channels.concat(categories)

	let cache = []
	for (let i = 0; i < channels.length; i++) {
		if (i % 10 === 0) {
			await Promise.all(cache)
			cache = []
		}

		cache.push(channels[i].delete())
	}

	await Promise.all(cache)

	await message.channel.send(":ok: Deleted **" + channels.length + "** text and category channels.")
}
