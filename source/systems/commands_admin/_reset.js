var reset = require("../game_reset/reset.js")

module.exports = async function (message, params, config) {
	await message.channel.send(":ok:  Resetting.")

	await reset(message.client, config)
	await message.channel.send(":ok:  Reset.")
}
