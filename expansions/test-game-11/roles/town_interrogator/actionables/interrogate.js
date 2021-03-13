var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

var responses = {
	neutral: ":mag: Your target is a __Neutral__.",
	cult: ":mag: Your target belongs to the __Cult__.",
	mafia: ":mag: Your target is a member of the __Mafia__.",
	town: ":mag: Your target is not suspicious.",

	role: ":mag: Your target's role is **{;role}**.",
}

module.exports = function (actionable, game, params) {
	game.addAction("town_interrogator/chat_mediator", ["postcycle"], {
		from: one,
		to: two,
		matcher: matcher.identifier,
		expiry: Infinity,
		tags: ["permanent"],
	})

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
		// Show Town
		createChannels()
	}

	async function createChannels() {
		var read_perms = game.config["base-perms"]["read"]

		var channel_name = "interrogation-" + target.alphabet

		var channel = await game.createPrivateChannel(channel_name, [
			{ target: from.getDiscordUser(), permissions: read_perms },
			{ target: target.getDiscordUser(), permissions: read_perms },
		])

		from.misc.interrogation_channel = channel.id

		await channel.send("**This is the interrogation chat.**")

		from.addSpecialChannel(channel)
		target.addSpecialChannel(channel)
	}
}

module.exports.TAGS = ["drivable", "roleblockable", "visit"]
