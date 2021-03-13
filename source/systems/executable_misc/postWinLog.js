var format = require("./__formatter.js")
var texts = require("./text/texts.js")

var logger = process.logger

module.exports = async function (game, faction, description) {
	var message = texts.win_log

	message = message.replace(new RegExp("{;faction}", "g"), faction.charAt(0).toUpperCase() + faction.slice(1))
	message = message.replace(new RegExp("{;description}", "g"), description)

	var players = game.players
	var concat = new Array()

	var flavour = game.getGameFlavour()

	var display_role_equivalent = false

	if (flavour && flavour.info["display-role-equivalent-in-win-log"]) {
		display_role_equivalent = true
	}

	for (var i = 0; i < players.length; i++) {
		var player = players[i]
		var display_name = player.getDisplayName()

		var text = "**" + display_name + "**: " + player.getInitialRole(display_role_equivalent)

		if (player.getStatus("won") === true) {
			// Add a star
			text = text + " (:star:)"
		}

		concat.push(text)
	}

	message = message.replace(new RegExp("{;role_list}", "g"), concat.join("\n"))

	await game.getLogChannel().send(format(game, message), { split: true })
	await game.getLogChannel().send(format(game, getSummary()), { split: true })

	function getSummary() {
		var players = game.players
		var display_message = "```\nGame Summary\n̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅\n"

		var information_list = []
		var survivors_display = ""

		for (var i = 0; i < players.length; i++) {
			if (!players[i].status.alive) {
				if (players[i].misc.time_of_death == undefined) {
					information_list.push([game.getPeriod() + 0.1, players[i]])
				} else {
					information_list.push([players[i].misc.time_of_death, players[i]])
				}
			} else {
				survivors_display = survivors_display + players[i].getDisplayName() + ", "
			}
		}

		if (information_list.length == 0) {
			return ""
		}

		let sorted_list = information_list.sort((a, b) => a[0] - b[0])

		var srtlist = sorted_list.length - 1

		var surv = survivors_display.length - 2

		var counter2 = 0

		for (var i = 0; i < players.length * 2; i++) {
			if (counter2 > sorted_list.length - 1) {
				return display_message + "\nSURVIVORS:\n" + survivors_display.substring(0, surv) + "\n```"
			}

			var count = 0

			for (var j = 0; j < sorted_list.length; j++) {
				if (Math.floor(information_list[j][0]) == i) {
					display_message =
						display_message +
						returnDayNight(information_list[j][0]) +
						": " +
						sorted_list[j][1].getDisplayName() +
						returnCauseOfDeath(information_list[j][0]) +
						"\n"
					count++
				}
			}

			if (count == 0) {
				if (i % 2 == 1) {
					display_message = display_message + returnDayNight(i) + ": No deaths\n"
				} else {
					display_message = display_message + returnDayNight(i) + ": No-lynch\n"
				}
			}
			counter2 = counter2 + count
		}

		return counter2 + srtlist
	}

	//(Math.round(number*10)/10)

	function returnDayNight(number) {
		if (
			Math.round((number % 2) * 10) / 10 == 1 ||
			Math.round((number % 2) * 10) / 10 == 1.1 ||
			Math.round((number % 2) * 100) / 100 == 1.05
		) {
			return "N" + (Math.floor(number) + 1) / 2
		} else {
			return "D" + Math.floor(number) / 2
		}
	}

	function returnCauseOfDeath(number) {
		if (Math.round((number % 1) * 100) / 100 == 0.05) {
			return " modkilled"
		}
		if (Math.round((number % 2) * 10) / 10 == 1.1 || Math.round((number % 2) * 10) / 10 == 1) {
			return " killed"
		}
		if (Math.round((number % 2) * 10) / 10 == 0 || Math.round((number % 2) * 10) / 10 == 0.1) {
			return " shot"
		}
		if (Math.round((number % 2) * 10) / 10 == 0.2) {
			return " lynched"
		}
		return " BOT ISSUE"
	}
}
