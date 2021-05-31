import fs from "fs"
import path from "path"
import recursiveFileFind from "../auxils/recursiveFileFind"
import {
	AdminCommand,
	Command,
	CommandProperties,
	CommandType,
	ConsoleCommand,
	GameCommand,
	UnaffiliatedCommand,
} from "./CommandType"
import requireScript from "../auxils/requireScript"

export const readCommand = <T>(fileName: string): CommandProperties<T> => {
	const script = requireScript<T>(fileName)

	if (typeof script === "object") {
		const props = (script as unknown) as CommandProperties<T>
		if (!props.name) {
			throw new Error(`No name specified for command in file ${fileName}`)
		}
		if (!props.description) {
			throw new Error(`No description specified for command in file ${fileName}`)
		}
		if (!props.command) {
			throw new Error(`No command specified for command in file ${fileName}`)
		}
		return props
	}
	const name = path.parse(fileName).name
	return {
		name,
		description: name,
		command: script,
	}
}

export const readCommands = <T, S>(directory: string, type: T): CommandType<T, S>[] =>
	recursiveFileFind(directory, ["ts", "js"]).map((fileName) => ({
		type,
		...readCommand<S>(fileName),
	}))

export const tryReadCommands = <T, S>(directory: string, type: T): CommandType<T, S>[] =>
	fs.existsSync(directory) ? readCommands<T, S>(directory, type) : []

export const readAllCommandTypes = (directory: string): Command[] => {
	const tryRead = <T extends string, S>(type: T): CommandType<T, S>[] =>
		tryReadCommands<T, S>(directory + "/" + type, type)
	return [
		...tryRead<"game", GameCommand>("game"),
		...tryRead<"admin", AdminCommand>("admin"),
		...tryRead<"unaffiliated", UnaffiliatedCommand>("unaffiliated"),
		...tryRead<"console", ConsoleCommand>("console"),
	]
}
