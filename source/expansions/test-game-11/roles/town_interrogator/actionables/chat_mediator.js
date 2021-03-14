var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	// Suicide

	var config = game.config

	var target = game.getPlayerByIdentifier(actionable.from)

	var channel_id = target.misc.interrogation_channel

	var channel = game.getChannelById(channel_id)

	if (!channel) {
		return null
	}

	if (target.misc.interrogation_channel) {
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