const fetch = require("node-fetch")

module.exports = async function (message, params, config) {
	const endpoint = "https://icanhazdadjoke.com/"

	message.channel.startTyping()

	const body = await fetch(endpoint, { headers: { Accept: "text/plain" } })
	const joke = await body.text()

	await message.channel.send(":bamboo: " + joke)
	await message.channel.stopTyping()
}
