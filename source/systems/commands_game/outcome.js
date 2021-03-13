var Discord = require("discord.js")

module.exports = async function (game, message, params) {
	if (!game.isDay()) {
		await message.channel.send(":x:  There is no trial during the night!")
		return null
	}

	var config = game.config
	var roles = game.players

	var lynch_config = config["game"]["lynch"]

	var no_lynch_votes = game.getNoLynchVoteCount()

	most_votes_on_player = 0
	number_of_highest_tied = 0
	players_alive = 0

	var players = new Array()

	for (var i = 0; i < roles.length; i++) {
		if (roles[i].status.alive) {
			players_alive++
		}
	}

	for (var i = 0; i < roles.length; i++) {
		if (roles[i].status.alive) {
			if (most_votes_on_player == roles[i].countVotes()) {
				players.push(roles[i].getDisplayName())
			}
			if (most_votes_on_player < roles[i].countVotes() && !(2 * most_votes_on_player > players_alive)) {
				var players = new Array()
				players.push(roles[i].getDisplayName())

				most_votes_on_player = roles[i].countVotes()
			}
		}
	}

	if (lynch_config["top-voted-lynch"]) {
		if (lynch_config["top-voted-lynch-minimum-votes"] > most_votes_on_player) {
			message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
		} else {
			if (no_lynch_votes > most_votes_on_player) {
				message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
			} else if (no_lynch_votes < most_votes_on_player) {
				if (players.length == 1) {
					message.channel.send(":thought_balloon:  With the current votes **" + players[0] + "** will be __lynched__.")
				} else {
					if (lynch_config["tied-random"]) {
						var display = ":one:  **" + players[0] + "** __lynced__!,   "
						for (var i = 0; i < players.length - 1; i++) {
							switch (i) {
								case 0:
									var number = ":two:"
									break
								case 1:
									var number = ":three:"
									break
								case 2:
									var number = ":four:"
									break
								case 3:
									var number = ":five:"
									break
								case 4:
									var number = ":six:"
									break
								case 5:
									var number = ":seven:"
									break
								case 6:
									var number = ":eight:"
									break
								case 7:
									var number = ":nine:"
							}
							if (i > 7) {
								var number = ":information_source:"
							}
							display = display + number + "  **" + players[i + 1] + "** __lynced__!,   "
						}

						message.channel.send(
							":thought_balloon:  With the current votes one of the two following options will occur:\n" + display
						)
					} else {
						message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
					}
				}
			} else {
				if (lynch_config["tied-random"]) {
					players.push("No-lynch")

					var display = ":one:  **" + players[-1] + ",   "
					for (var i = 0; i < players.length - 1; i++) {
						switch (i) {
							case 0:
								var number = ":two:"
								break
							case 1:
								var number = ":three:"
								break
							case 2:
								var number = ":four:"
								break
							case 3:
								var number = ":five:"
								break
							case 4:
								var number = ":six:"
								break
							case 5:
								var number = ":seven:"
								break
							case 6:
								var number = ":eight:"
								break
							case 7:
								var number = ":nine:"
						}
						if (i > 7) {
							var number = ":information_source:"
						}
						display = display + number + "  **" + players[i] + "** __lynched__!,   "
					}

					message.channel.send(
						":thought_balloon:  With the current votes one of the two following options will occur:\n" + display
					)
				} else {
					message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
				}
			}
		}
	} else {
		if (lynch_config["allow-hammer"]) {
			message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
		} else {
			var display = "**" + players[0] + "**"
			if (players.length > 1) {
				for (var i = 0; i < players.length - 2; i++) {
					display = display + ", " + players[i + 1]
				}
				display = display + "**" + players[players.length - 1] + "**"
				message.channel.send(":thought_balloon:  With the current votes " + diaplay + " will be __lynched__.")
			} else {
				message.channel.send(":thought_balloon:  With the current votes a **no-lynch** will occur.")
			}
		}
	}
}

module.exports.ALLOW_PREGAME = false
module.exports.ALLOW_GAME = true
module.exports.ALLOW_POSTGAME = false
