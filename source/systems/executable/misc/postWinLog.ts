import format from "./__formatter"
import texts from "./text/texts"
import Game from "../../game_templates/Game"

const getSummary = (game: Game) => {
	const players = game.players
	let display_message = "```\nGame Summary\n̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅\n"

	const information_list = []
	let survivors_display = ""

	for (const player of players) {
		if (!player.status.alive) {
			let alignment: string
			if (player.getRoleOrThrow().alignment === "town") {
				alignment = "🏡"
			} else if (["mafia", "mafia_team_1", "mafia_team_2"].includes(player.getRoleOrThrow().alignment)) {
				alignment = "👨‍⚖️"
			} else {
				alignment = "🌒"
			}

			if (player.misc.time_of_death == undefined) {
				information_list.push([game.getPeriod() + 0.1, alignment + " " + player.getDisplayName()])
			} else {
				information_list.push([player.misc.time_of_death, alignment + " " + player.getDisplayName()])
			}
		} else {
			survivors_display = survivors_display + player.getDisplayName() + ", "
		}
	}

	if (information_list.length == 0) {
		return ""
	}

	const sorted_list = information_list.sort((a, b) => a[0] - b[0])

	const srtlist = sorted_list.length - 1

	const surv = survivors_display.length - 2

	let counter2 = 0

	for (let i = 0; i < players.length * 2; i++) {
		if (counter2 > sorted_list.length - 1) {
			return display_message + "\nSURVIVORS:\n" + survivors_display.substring(0, surv) + "\n```"
		}

		let count = 0

		for (let j = 0; j < sorted_list.length; j++) {
			if (Math.floor(information_list[j][0]) == i) {
				display_message =
					display_message +
					returnDayNight(information_list[j][0]) +
					": " +
					sorted_list[j][1] +
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

const returnDayNight = (number: number): string => {
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

const returnCauseOfDeath = (number: number): string => {
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

const postWinLog = async (game: Game, faction: string, description: string): Promise<void> => {
	let message = texts.win_log

	message = message.replace(new RegExp("{;faction}", "g"), faction.charAt(0).toUpperCase() + faction.slice(1))
	message = message.replace(new RegExp("{;description}", "g"), description)

	const players = game.players
	const concat = []

	const flavour = game.getGameFlavour()

	let display_role_equivalent = false

	if (flavour && flavour.info["display-role-equivalent-in-win-log"]) {
		display_role_equivalent = true
	}

	for (let i = 0; i < players.length; i++) {
		const player = players[i]
		const display_name = player.getDisplayName()

		let text = "**" + display_name + "**: " + player.getInitialRole(display_role_equivalent)

		if (player.getStatus("won") === true) {
			// Add a star
			text = text + " (:star:)"
		}

		concat.push(text)
	}

	message = message.replace(new RegExp("{;role_list}", "g"), concat.join("\n"))

	await game.getLogChannel().send(format(game, message), { split: true })
	await game.getLogChannel().send(format(game, getSummary(game).toString()), { split: true })
}

export default postWinLog
