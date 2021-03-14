var mafia = require("../../../../../lcn")

var rs = mafia.rolesystem

module.exports = function (actionable, game, params) {
	// Suicide

	var config = game.config

	var target = game.getPlayerByIdentifier(actionable.from)

	var channel_id = target.misc.matched_lover_channel

	var channel = game.getChannelById(channel_id)

	if (!channel) {
		return null
	}

	if (target.misc.matched_lover_initiator) {
		channel.send("~~                                              ~~    **" + game.getFormattedDay() + "**")
	}

	var member = target.getGuildMember()

	if (!member) {
		return null
	}

	if (game.isDay()) {
		// Day time
		channel.createOverwrite(member, config["base-perms"]["read"])
	} else {
		// Night time
		channel.createOverwrite(member, config["base-perms"]["post"])
	}
}