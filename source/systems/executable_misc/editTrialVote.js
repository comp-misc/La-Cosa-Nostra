var texts = require("./text/texts.js")
var format = require("./__formatter.js")
var auxils = require("./../auxils.js")

module.exports = async function (game, ended = false) {
	var roles = game.players
	var client = game.client
	var config = game.config

	var no_lynch_option = game.config["game"]["lynch"]["no-lynch-option"]

	var log = game.getPeriodLog()

	var guild = client.guilds.get(config["server-id"])
	var channel = guild.channels.get(log.trial_vote.channel)

	var display_message = await channel.fetchMessage(log.trial_vote.messages[0])

	if (ended) {
		var message = texts.public_vote_ended
	} else {
		var message = texts.public_vote
	}

	message = message.replace("{;day}", game.getPeriod() / 2)
	message = message.replace("{;vote_info}", getVoteInfo())
	message = message.replace("{;public_votes}", getVoteList())

	await display_message.edit(format(game, message))

	function getVoteList() {
		var players_alive = 0
		var players_voting = new Array()

		for (var i = 0; i < roles.length; i++) {
			if (roles[i].status.alive) {
				players_alive++
			}
		}

		if (players_alive % 2 == 1) {
			var lynch_votes = (players_alive + 1) / 2
			var nolynch_votes = (players_alive + 1) / 2
		} else {
			var lynch_votes = (players_alive + 2) / 2
			var nolynch_votes = players_alive / 2
		}

		var displays = new Array()
		for (var i = 0; i < roles.length; i++) {
			if (roles[i].status.alive) {
				// Get display role

				if (roles[i].getStatus("lynch-proof")) {
					displays.push("<@" + roles[i].id + "> (\\✖)")
					continue
				}

				// Get people voting against
				var voting_against = roles[i].votes
				var concat = new Array()

				// Get their display names
				for (var j = 0; j < voting_against.length; j++) {
					// Mapped by IDs
					var player = game.getPlayerByIdentifier(voting_against[j].identifier)

					players_voting.push(voting_against[j].identifier)

					concat.push(player.getDisplayName())
				}

				var names = auxils.pettyFormat(concat)

				names = voting_against.length > 0 ? ": " + names : ""

				displays.push("<@" + roles[i].id + "> (" + roles[i].countVotes() + "/" + lynch_votes + ")" + names)
			} else {
				if (roles[i].misc.time_of_death == undefined && game.getPeriod() % 2 == 0) {
					if (roles[i].getStatus("lynch-proof")) {
						displays.push("<@" + roles[i].id + "> (\\✖)")
						continue
					}

					// Get people voting against
					var voting_against = roles[i].votes
					var concat = new Array()

					// Get their display names
					for (var j = 0; j < voting_against.length; j++) {
						// Mapped by IDs
						var player = game.getPlayerByIdentifier(voting_against[j].identifier)

						players_voting.push(voting_against[j].identifier)

						concat.push(player.getDisplayName())
					}

					var names = auxils.pettyFormat(concat)

					names = voting_against.length > 0 ? ": " + names : ""

					displays.push("<@" + roles[i].id + "> (:x:)" + names)
				}
			}
		}

		if (no_lynch_option) {
			var voters = game.getNoLynchVoters()
			var vote_count = game.getNoLynchVoteCount()

			for (var j = 0; j < voters.length; j++) {
				players_voting.push(voters[j])
			}

			var concat = voters.map((x) => game.getPlayerByIdentifier(x).getDisplayName())

			var names = auxils.pettyFormat(concat)

			names = voters.length > 0 ? ": " + names : ""

			displays.push("No-lynch (" + vote_count + "/" + nolynch_votes + ")" + names)
		}

		var special_vote_types = game.getPeriodLog().special_vote_types

		for (var i = 0; i < special_vote_types.length; i++) {
			var voters = special_vote_types[i].voters
			var vote_count = game.getSpecialVoteCount(special_vote_types[i].identifier)

			for (var j = 0; j < voters.length; j++) {
				players_voting.push(voters[j])
			}
			var names = auxils.pettyFormat(voters.map((x) => game.getPlayerByIdentifier(x.identifier).getDisplayName()))

			names = voters.length > 0 ? ": " + names : ""

			displays.push("**" + special_vote_types[i].name + "** (" + vote_count + ")" + names)
		}

		var voters = []

		for (var i = 0; i < roles.length; i++) {
			if (roles[i].status.alive) {
				if (!players_voting.includes(roles[i].identifier)) {
					voters.push(roles[i].identifier)
				}
			}
		}

		displays.push("\nNot voting (" + voters.length + "/" + players_alive + ")")

		return displays.join("\n")
	}

	function getVoteInfo() {
		var players_alive = 0

		for (var i = 0; i < roles.length; i++) {
			if (roles[i].status.alive) {
				players_alive++
			}
		}

		if (players_alive % 2 == 1) {
			var lynch_votes = (players_alive + 1) / 2
			var nolynch_votes = (players_alive + 1) / 2
		} else {
			var lynch_votes = (players_alive + 2) / 2
			var nolynch_votes = players_alive / 2
		}

		return "There are required **" + lynch_votes + "** votes to lynch, and **" + nolynch_votes + "** votes to no-lynch."
	}
}
