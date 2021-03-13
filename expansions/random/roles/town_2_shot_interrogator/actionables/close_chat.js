var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (actionable, game, params) {
	var config = game.config

	var from = game.getPlayerByIdentifier(actionable.from)
	var to = game.getPlayerByIdentifier(actionable.to)

	var channel_id = from.misc.interrogation_channel

	var channel = game.getChannelById(channel_id)

	if (!channel) {
		return null
	}

	channel.send("**The Interrogation is now over.**")

	var member1 = from.getGuildMember()
	var member2 = to.getGuildMember()

	if (!member1 || !member2) {
		return null
	}

	channel.overwritePermissions(member1, config["base-perms"]["read"])
	channel.overwritePermissions(member2, config["base-perms"]["read"])
}
