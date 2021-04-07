import Discord, {
	APIMessageContentResolvable,
	Client,
	ClientEvents,
	Message,
	MessageAdditions,
	MessageOptions,
	TextChannel,
} from "discord.js"
import fs from "fs"
import eventhandler from "./auxils/eventhandler"
import readline from "./auxils/readline"
import round from "./auxils/round"
import botDirectories from "./BotDirectories"
import * as CommandExecutors from "./commands/CommandExecutors"
import { findCommand } from "./commands/commandFinder"
import getGuild from "./getGuild"
import { getTimer, hasTimer, setTimer } from "./getTimer"
import init from "./init"
import { ChannelsConfig } from "./LcnConfig"
import MemberMessage from "./MemberMessage"
import updatePresence from "./systems/executable/misc/updatePresence"
import Timer from "./systems/game_templates/Timer"
import version from "./Version"
import { CommandUsageError } from "./commands/CommandType"
import dotenv from "dotenv"

dotenv.config()

const client = new Discord.Client({
	disableMentions: "everyone",
})
const [logger, lcn] = init()
const { commands, config } = lcn

const serverId = process.env["server-id"]
if (!serverId) {
	throw new Error("Must define a 'server-id' environment variable")
}

const botToken = process.env["bot-token"]
if (!botToken) {
	throw new Error("Must define a 'bot-token' environment variable")
}

export const getTextChannel = (channel: keyof ChannelsConfig): TextChannel => {
	const ch = getGuild(client).channels.cache.find((x) => x.name === config.channels[channel])
	if (!ch) {
		throw new Error(`Unknown channel '${channel}'`)
	}
	if (!(ch instanceof TextChannel)) {
		throw new Error(`Channel ${ch.name} is not a Text Channel`)
	}
	return ch
}

export const onWithError = <K extends keyof ClientEvents>(
	event: K,
	listener: (...args: ClientEvents[K]) => void
): void => {
	client.on<K>(event, async (...args) => {
		try {
			await listener(...args)
		} catch (e) {
			logger.logError(e)
		}
	})
}

const load_time = process.uptime() * 1000

onWithError("ready", async () => {
	if (!(await client.guilds.fetch(serverId))) {
		throw new Error("Invalid guild ID entered in the configuration.")
	}

	logger.log(2, "%s SUM [%s] ready.", version.updateName, version.version)

	const login_time = process.uptime() * 1000

	ready()

	await setStatus(client)

	let save_status = "NONE ATTEMPTED"

	if (config["automatically-load-saves"]) {
		save_status = await autoload()
	}

	const total_load_time = process.uptime() * 1000
	const stats = [
		lcn.expansions.length,
		lcn.expansions.map((x) => x.expansion.name).join(", "),
		Object.keys(lcn.roles).length,
		Object.keys(lcn.attributes).length,
		Object.keys(lcn.flavours).length,
		Object.keys(lcn.win_conditions).length,
		Object.keys(lcn.commands.filter((c) => c.type === "role")).length,
		Object.keys(lcn.assets).length,
		round(load_time),
		round(login_time - load_time),
		round(total_load_time - login_time),
		save_status,
		round(total_load_time, 2),
	]
	logger.log(
		2,
		'\n--- Statistics ---\n[Modules]\nLoaded %s expansion(s) [%s];\nLoaded %s role(s);\nLoaded %s attribute(s);\nLoaded %s flavour(s);\nLoaded %s unique win condition(s);\nLoaded %s command handle(s);\nLoaded %s non-flavour asset(s)\n\n[Startup]\nLoad: %sms;\nLogin: %sms;\nSave: %sms [%s];\nTotal: %sms\n-------------------\nEnter "autosetup" for auto-setup.\nEnter "help" for help.\n',
		...stats.map((x) => x.toString())
	)
})

onWithError("message", async (message) => {
	if (message.author.bot) {
		return
	}

	//TODO Remove this in v13
	//I've started to implement 'reply' to messages instead of sending a message,
	//but unfortunately at this it only tags a player instead of inline replying
	;(message as any).reply = (
		content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions
	): Promise<Message> => {
		return message.channel.send(content)
	}

	const content = message.content

	const cmdPrefix = config["command-prefix"]
	if (
		!content.startsWith(cmdPrefix) ||
		content.startsWith(cmdPrefix + cmdPrefix) //Extra check prevents messages such as !!! being treated as commands
	) {
		return
	}
	if (message.channel.type === "dm") {
		await message.reply(":x: I do not handle commands in DM. Please use a guild channel instead.")
		return
	}
	const member = message.member
	if (!member || !message.guild) {
		await message.reply(":x: You must be a member of the server to use commands")
		return
	}

	const edited = content.substring(config["command-prefix"].length, content.length).split(/[ ]/g)
	const command = edited[0]

	edited.splice(0, 1)

	if (config["disabled-commands"].includes(command)) {
		await message.reply(":x: That command has been disabled in the configuration!")
		return
	}

	const foundCommand = findCommand(
		commands,
		command,
		message.member,
		message.channel,
		(cmd) => cmd.type !== "console"
	)
	if (!foundCommand) {
		await message.reply(":x: Unknown command")
		return
	}

	const memberMessage = message as MemberMessage

	try {
		switch (foundCommand.type) {
			case "admin":
				await CommandExecutors.executeAdminCommand(foundCommand, memberMessage, edited, config)
				break
			case "game":
				await CommandExecutors.executeGameCommand(foundCommand, memberMessage, edited)
				break
			case "unaffiliated":
				await foundCommand.command(memberMessage, edited, config)
				break
			case "role":
				await CommandExecutors.executeRoleCommand(foundCommand, memberMessage, edited)
				break
			default:
				throw new Error(`Unknown command type '${foundCommand.type}'`)
		}
	} catch (e) {
		if (e instanceof CommandUsageError) {
			const usage = foundCommand.usage || config["command-prefix"] + foundCommand.name
			await message.reply(`:x: ${e.message}. Usage: ${usage}`)
		} else {
			await message.reply(
				":x: A code-level bot error occurred. Please contact the bot administrator to check the console immediately."
			)
			throw e
		}
	}
})

onWithError("guildMemberAdd", async (member) => {
	const guild = getGuild(client)
	const welcome = guild.channels.cache.find((x) => x.name === config.channels["welcome-channel"])

	if (!welcome) {
		return
	}

	// Send rule message
	const welcomeMessage = config.messages["welcome-message"]
	if (welcomeMessage) {
		const msg = welcomeMessage.replace(new RegExp("{;member}", "g"), "<@" + member.id + ">")
		await (welcome as TextChannel).send(msg)
	}

	const welcomeDmMessage = config.messages["welcome-dm-message"]
	if (welcomeDmMessage) {
		await member.send(welcomeDmMessage)
	}
})

onWithError("disconnect", async (close_event) => {
	if (hasTimer()) {
		getTimer().save()
	}

	logger.log(3, "Close event: ", close_event.reason)

	if (config["auto-reconnect"]) {
		logger.log(3, "Automatic restart script initialised.")
		// Attempt reconnection
		await client.login(process.env["bot-token"])
	}
})

client.on("error", (error) => {
	logger.log(
		0,
		"[Websocket] Websocket connection error. Not fatal. Discord.js will attempt automatic reconnection, so there is nothing to worry about unless the log stops here."
	)
	logger.logError(error)
})

client.on("resume", () => {
	logger.log(0, "[Websocket] Websocket connection has been resumed.")
})

client.on("warn", (warning) => {
	logger.log(3, "[Discord.js warning] %s", warning)
})

// Ready
function ready() {
	if (!(process as any).ready) {
		readline(client, config, commands)
		eventhandler(client, config)
		;(process as any).ready = true
	}
}

// Autoload
async function autoload() {
	// Check for game save
	const saved = fs.existsSync(botDirectories.data + "/game_cache/game.json")

	if (!saved) {
		logger.log(2, "\x1b[1m%s\x1b[0m", "No game save found.")
		return "\x1b[1m\x1b[34mNO SAVE FOUND\x1b[0m"
	}

	// Load the save
	let timer: Timer
	try {
		timer = await Timer.load(client, config)
	} catch (err) {
		logger.log(
			4,
			'Restoration of save failed due to a load error, are the save files corrupted? Use "reset" if necessary.'
		)
		logger.logError(err)
		return "\x1b[1m\x1b[31mERRORED - CHECK LOGS\x1b[0m"
	}

	if (!timer) {
		logger.log(2, "\x1b[1m%s\x1b[0m", "Did not restore save.")
		return "\x1b[1m\x1b[31mFAILED\x1b[0m"
	}

	// eslint-disable-next-line @typescript-eslint/no-extra-semi
	setTimer(timer)

	logger.log(2, "\x1b[1m%s\x1b[0m", "Restored save.")

	return "\x1b[1m\x1b[32mSUCCESSFUL\x1b[0m"
}

client
	.login(botToken)
	.then(() => console.log("Successfully logged in"))
	.catch(logger.logError)

export const setStatus = (client: Client): Promise<void> =>
	updatePresence(client, {
		status: "online",
		activity: {
			name: version.updateName + " LCN " + version.version,
			type: "PLAYING",
		},
	})
