var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem

var responses = {
	neutral: ":mag: Your target is a __Neutral__.",
	cult: ":mag: Your target belongs to the __Cult__.",
	mafia: ":mag: Your target is a member of the __Mafia__.",
	town: ":mag: Your target is not suspicious.",

	role: ":mag: Your target's role is **{;role}**.",
}

module.exports = function (actionable, game, params, player) {
	game.execute("visit", {
		visitor: actionable.from,
		target: actionable.to,
		priority: actionable.priority,
		reason: "Sheriff-interrogation",
	})

	var from = game.getPlayerByIdentifier(actionable.from)
	var target = game.getPlayerByIdentifier(actionable.to)

	// Check roles
	var immunity = target.getStat("detection-immunity")

	// Not immune
	if (immunity < 1) {
		// Vagrant
		if (immunity < 0) {
			if (target.role.alignment === "town") {
				game.addMessage(from, responses["mafia"])
			} else {
				game.addMessage(from, responses["town"])
			}

			return null
		}

		if (target.role["reveal-role-on-interrogation"] === true) {
			createChannels()
		} else {
			createChannels()
		}
	} else {
		createChannels()
	}

	async function createChannels() {
		var read_perms = game.config["base-perms"]["read"]["post"]

		var channel_name = "interrogation-" + target.alphabet

		var channel = await game.createPrivateChannel(channel_name, [
			{ target: from.getDiscordUser(), permissions: read_perms },
			{ target: target.getDiscordUser(), permissions: read_perms },
		])

		await channel.send("**This is the interrogation chat.**")

		from.misc.inter_channel = channel.id
		target.misc.inter_channel = channel.id
		from.addSpecialChannel(channel)
		target.addSpecialChannel(channel)

		if (game.isDay()) {
			var channel = game.getChannel("interrogation-" + target.alphabet)
			channel.overwritePermissions(member, game.config["base-perms"]["read"])
		}
	}
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
