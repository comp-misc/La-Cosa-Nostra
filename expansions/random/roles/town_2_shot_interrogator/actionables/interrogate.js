var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var from = game.getPlayerByIdentifier(actionable.from)
	var target = game.getPlayerByIdentifier(actionable.to)

	game.addMessage(target, ":exclamation: **" + from.getDisplayName() + "** brought you up to an interrogation.")

	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Sheriff-interrogation",
	})

	game.addAction("town_2_shot_interrogator/close_chat", ["cycle"], {
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

		var channel = await game.createPrivateChannel(channel_name, [
			{ target: from.getDiscordUser(), permissions: read_perms },
			{ target: target.getDiscordUser(), permissions: read_perms },
		])

		await channel.send("**This is the interrogation chat.**")

		from.misc.interrogation_channel = channel.id

		from.addSpecialChannel(channel)
		target.addSpecialChannel(channel)
	}

	from.misc.interrogates_left--
}

module.exports.TAGS = ["visit"]
