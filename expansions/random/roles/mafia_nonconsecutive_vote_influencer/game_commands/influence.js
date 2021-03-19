// Register heal

var lcn = require("../../../../../source/lcn")

var rs = lcn.rolesystem

module.exports = function (game, message, params) {
	var actions = game.actions
	var config = game.config

	var from = game.getPlayerById(message.author.id)

	if (from.misc.consecutive_night === true) {
		message.channel.send(":x:  You may not use an action on two consecutive nights!")

		return null
	}

	// Run checks, etc

	if (params[0] === undefined) {
		message.channel.send(
			":x:  Wrong syntax! Please use `" + config["command-prefix"] + "influence <alphabet/username/nobody>` instead!"
		)
		return null
	}

	var to = game.getPlayerMatch(params[0])

	if (to.score < 0.7 || params[0].toLowerCase() === "nobody") {
		actions.delete(
			(x) =>
				x.from === from.identifier &&
				(x.identifier === "mafia_nonconsecutive_vote_influencer/influence" ||
					x.identifier === "mafia_nonconsecutive_vote_influencer/block" ||
					x.identifier === "mafia_nonconsecutive_vote_influencer/no_action")
		)

		game.addAction("mafia_nonconsecutive_vote_influencer/no_action", ["cycle"], {
			name: "SE-no_action",
			expiry: 1,
			from: message.author.id,
			to: message.author.id,
		})

		message.channel.send(":bookmark:  You have now selected to not to block nor influence the vote of anyone tonight.")
		game
			.getChannel("mafia")
			.send(":bookmark:  **" + from.getDisplayName() + "** is not blocking nor influencing the vote of anyone tonight.")

		return null
	}

	to = to.player

	if (!to.isAlive()) {
		message.channel.send(":x:  You cannot influence the vote of a dead player!")

		return null
	}

	if (from.misc.influencer_log[0] === to.identifier) {
		message.channel.send(":x:  You cannot block or influence the vote of the same player consecutively!")

		return null
	}

	if (to.id === message.author.id) {
		var mention = "yourself"
		var mention2 = "themself"
	} else {
		var mention = to.getDisplayName()
		var mention2 = to.getDisplayName()
	}

	actions.delete(
		(x) =>
			x.from === from.identifier &&
			(x.identifier === "mafia_nonconsecutive_vote_influencer/influence" ||
				x.identifier === "mafia_nonconsecutive_vote_influencer/block" ||
				x.identifier === "mafia_nonconsecutive_vote_influencer/no_action")
	)

	game.addAction("mafia_nonconsecutive_vote_influencer/influence", ["cycle"], {
		name: "SE-influence",
		expiry: 1,
		from: message.author.id,
		to: to.id,
	})

	message.channel.send(":bookmark:  You have now selected to influence the vote of **" + mention + "** tonight.")
	game
		.getChannel("mafia")
		.send(":bookmark:  **" + from.getDisplayName() + "** is influencing the vote of **" + mention2 + "** tonight.")
}

module.exports.ALLOW_NONSPECIFIC = false
module.exports.PRIVATE_ONLY = true
module.exports.DEAD_CANNOT_USE = true
module.exports.ALIVE_CANNOT_USE = false
module.exports.DISALLOW_DAY = true
module.exports.DISALLOW_NIGHT = false
