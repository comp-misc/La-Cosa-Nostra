var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params, message, client) {
	var from = game.getPlayerByIdentifier(actionable.from)
	var target = game.getPlayerByIdentifier(actionable.to)

	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Sheriff-interrogation",
	})

	game.addAction("town_sheriff_cop/close_chat", ["cycle"], {
		name: "Poison-kill",
		expiry: 2,
		execution: 2,
		from: actionable.from,
		to: actionable.to,
		priority: 0.01,
		tags: ["poison"],
	})

	createChannels()

	async function createChannels() {
		var read_perms = game.config["base-perms"]["post"]

		var channel_name = "interrogation-" + target.alphabet

		var fromchannel = from.getPrivateChannel()

		var channel = await game.createPrivateChannel(channel_name, [
			{ target: target.getDiscordUser(), permissions: read_perms },
		])

		await channel.send("**This is the interrogation chat.**")
		await from.game.sendPeriodPin(fromchannel, "\n.")

		from.misc.interrogation_channel = channel.id

		from.addSpecialChannel(channel)
		target.addSpecialChannel(channel)
	}
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
