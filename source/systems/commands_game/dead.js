var Discord = require("discord.js")

var lcn = require("../../../source/lcn.js")

var auxils = lcn.auxils

module.exports = async function (game, message, params) {
	var roles = game.players

	var players_dead = 0
	var display_message = ""

	var information_list = []

	//liste.push([a,b])

	for (var i = 0; i < roles.length; i++) {
		if (!roles[i].status.alive) {
			players_dead++

			if (roles[i].misc.time_of_death == undefined) {
				roles[i].misc.time_of_death = game.getPeriod()
				information_list.push([game.getPeriod(), roles[i]])
			} else {
				//if already defined -> either because, 1) defined here before or 2) defined in .../executable_misc/getDeathMessage.js

				information_list.push([roles[i].misc.time_of_death, roles[i]])
			}
		}
	}

	if (players_dead < 1) {
		message.channel.send("There are __0__ dead players.")
	} else {
		if (players_dead == 1) {
			var grammar = "is"
		} else {
			var grammar = "are"
		}

		let sorted_list = information_list.sort((a, b) => a[0] - b[0])

		for (var i = 0; i < sorted_list.length; i++) {
			display_message =
				display_message +
				returnDayNight(information_list[i][0]) +
				": " +
				sorted_list[i][1].getDisplayName() +
				" - " +
				sorted_list[i][1].getDisplayRole(false) +
				"\n"
		}

		message.channel.send(
			"There " +
				grammar +
				" __" +
				players_dead +
				"__ dead player" +
				auxils.vocab("s", players_dead) +
				":\n```" +
				display_message +
				"```"
		)
	}

	function returnDayNight(number) {
		if (
			(Math.round((number % 2) * 10) / 10) % 2 == 1 ||
			(Math.round((number % 2) * 10) / 10) % 2 == 1.1 ||
			(Math.round((number % 2) * 100) / 100) % 2 == 1.05
		) {
			return "N" + (Math.floor(number) + 1) / 2
		} else {
			return "D" + Math.floor(number) / 2
		}
	}
}

module.exports.ALLOW_PREGAME = false
module.exports.ALLOW_GAME = true
module.exports.ALLOW_POSTGAME = false
