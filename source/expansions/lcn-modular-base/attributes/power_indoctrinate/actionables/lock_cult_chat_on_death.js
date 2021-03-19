var lcn = require("../../../../../lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var config = game.config

	var mentee = game.getPlayerByIdentifier(actionable.to)
	var mentor = game.getPlayerByIdentifier(actionable.from)

	var channel = game.getChannelById(mentor.misc.cult_channel)
	var user = recruit.getDiscordUser()

	if (!user) {
		return null
	}

	channel.createOverwrite(user, config["base-perms"]["read"])
}