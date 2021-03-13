import { UnaffiliatedCommand } from "../CommandType"

const currentDevelopers = ["Comp", "UNU"]
const formerDevelopers = ["ChocoParrot"]
const contributors = ["Marino", "Rookie", "Hex4Nova"]
const setupCreators = ["Captain Luffy", "Jobbiis", "Unusual"]
const alphaTesters = ["Justin", "Lia"]
const betaTesters = [
	"Ardvark8op",
	"ShapeShifted",
	"Les",
	"Lia",
	"Misode",
	"Conjurer",
	"Good Skele",
	"Hex4Nova",
	"Inffy",
]
const specialThanks = ["Error", "Fogalog", "Inffy", "Randium", "Sai Kurogetsu", "Alisha"]

const addPlayers = (players: string[], singular: string, plural?: string): string => {
	if (players.length == 0) return ""
	let result = "\n"
	if (players.length == 1) {
		result += `**${singular}**`
	} else {
		result += `**${plural || `${singular}s`}**`
	}
	result += `: ${players.join(", ")}`
	return result
}

const credits: UnaffiliatedCommand = async (message) => {
	let msg = ":medal: :medal:     __**Saviet Union Mafia Credits**__     :medal: :medal:"
	msg += "\n"
	msg += addPlayers(currentDevelopers, "Current Bot Developer")
	msg += "\n"
	msg += addPlayers(formerDevelopers, "Former Bot Developer")
	msg += addPlayers(contributors, "Contributor")
	msg += "\n"
	msg += addPlayers(setupCreators, "Setup Creator")
	msg += "\n"
	msg += addPlayers(alphaTesters, "Alpha Tester")
	msg += addPlayers(betaTesters, "Beta Tester")
	msg += "\n"
	msg += addPlayers(specialThanks, "Special thanks to", "Special thanks to")

	await message.channel.send(msg)
}

export = credits
