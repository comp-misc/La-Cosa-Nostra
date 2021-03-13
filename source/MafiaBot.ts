import version from "./Version"
import botDirectories from "./BotDirectories"
import Discord, { Client, ClientUser, TextChannel } from "discord.js"
import fs from "fs"
import init from "./init"
import round from "./auxils/round"
import readline from "./auxils/readline"
import eventhandler from "./auxils/eventhandler"
import Timer from "./systems/game_templates/Timer"
import { hasTimer, getTimer } from "./getTimer"
import getGuild from "./getGuild"
import { ChannelsConfig } from "./LcnConfig"
import * as CommandExecutors from "./commands/CommandExecutors"
import { findCommand } from "./commands/commandFinder"
import dotenv from "dotenv"

dotenv.config()

const client = new Discord.Client()
const [logger, lcn] = init()
const { commands, config } = lcn

export const getTextChannel = (channel: keyof ChannelsConfig): TextChannel => {
	const ch = getGuild(client).channels.find((x) => x.name === config.channels[channel])
	if (!ch) {
		throw new Error(`Unknown channel '${channel}'`)
	}
	if (!(ch instanceof TextChannel)) {
		throw new Error(`Channel ${ch.name} is not a Text Channel`)
	}
	return ch
}

const wrapError = <T>(f: (param: T) => void | Promise<void>): ((param: T) => Promise<void>) => async (p) => {
	try {
		return await f(p)
	} catch (e) {
		console.error(e)
		logger.logError(e)
		throw e
	}
}

client.options.disableEveryone = true

const load_time = process.uptime() * 1000

client.on(
	"ready",
	wrapError(() => {
		if (!client.guilds.some((x) => x.id === process.env["server-id"])) {
			throw new Error("Invalid guild ID entered in the configuration.")
		}

		logger.log(2, "%s SUM [%s] ready.", version.updateName, version.version)

		const login_time = process.uptime() * 1000

		ready()

		setStatus(client)

		let save_status = "NONE ATTEMPTED"

		if (config["automatically-load-saves"]) {
			save_status = autoload()
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
)

client.on(
	"message",
	wrapError(async (message) => {
		if (message.author.bot) {
			return
		}

		const content = message.content

		if (!content.startsWith(config["command-prefix"])) {
			return
		}
		if (message.channel.type === "dm") {
			await message.channel.send(":x: I do not handle commands in DM. Please use a guild channel instead.")
			return
		}

		const edited = content.substring(config["command-prefix"].length, content.length).split(/[ ]/g)
		const command = edited[0]

		edited.splice(0, 1)

		if (config["disabled-commands"].includes(command)) {
			message.channel.send(":x: That command has been disabled in the configuration!")
			return
		}

		const foundCommand = findCommand(commands, command, (cmd) => cmd.type !== "console")
		if (!foundCommand) {
			await message.reply(":x: Unknown command")
			return
		}

		try {
			switch (foundCommand.type) {
				case "admin":
					await CommandExecutors.executeAdminCommand(foundCommand, message, edited, config)
					break
				case "game":
					await CommandExecutors.executeGameCommand(foundCommand, message, edited)
					break
				case "unaffiliated":
					await foundCommand.command(message, edited, config)
					break
				case "role":
					await CommandExecutors.executeRoleCommand(foundCommand, message, edited)
					break
				default:
					throw new Error(`Unknown command type '${foundCommand.type}'`)
			}
		} catch (e) {
			console.log(e)
			logger.log(4, "Command execution error.")
			logger.logError(e)
			message.channel.send(
				":x: A code-level bot error occured. Please contact the bot administrator to check the console immediately."
			)
		}
	})
)

client.on(
	"guildMemberAdd",
	wrapError((member) => {
		const guild = getGuild(client)
		const welcome = guild.channels.find((x) => x.name === config.channels["welcome-channel"])

		if (!welcome) {
			return
		}

		// Send rule message
		const welcomeMessage = config.messages["welcome-message"]
		if (welcomeMessage) {
			const msg = welcomeMessage.replace(new RegExp("{;member}", "g"), "<@" + member.id + ">")
			;(welcome as TextChannel).send(msg)
		}

		const welcomeDmMessage = config.messages["welcome-dm-message"]
		if (welcomeDmMessage) {
			member.send(welcomeDmMessage)
		}
	})
)

client.on(
	"disconnect",
	wrapError((close_event) => {
		if (hasTimer()) {
			getTimer().save()
		}

		logger.log(3, "Close event: ", close_event.reason)

		if (config["auto-reconnect"]) {
			logger.log(3, "Automatic restart script initialised.")
			// Attempt reconnection
			client.login(process.env["bot-token"])
		}
	})
)

client.on(
	"error",
	wrapError((error) => {
		logger.log(
			0,
			"[Websocket] Websocket connection error. Not fatal. Discord.js will attempt automatic reconnection, so there is nothing to worry about unless the log stops here."
		)
		logger.logError(error)
	})
)

client.on(
	"resume",
	wrapError(() => {
		logger.log(0, "[Websocket] Websocket connection has been resumed.")
	})
)

client.on(
	"warn",
	wrapError((warning) => {
		logger.log(3, "[Discord.js warning] %s", warning)
	})
)

// Ready
function ready() {
	if (!(process as any).ready) {
		readline(client, config, commands)
		eventhandler(client, config)
		;(process as any).ready = true
	}
}

// Autoload
function autoload() {
	// Check for game save
	const saved = fs.existsSync(botDirectories.data + "/game_cache/game.save")

	if (!saved) {
		logger.log(2, "\x1b[1m%s\x1b[0m", "No game save found.")
		return "\x1b[1m\x1b[34mNO SAVE FOUND\x1b[0m"
	}

	// Load the save
	let timer: Timer
	try {
		timer = Timer.load(client, config)
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
	;(process as any)["timer"] = timer

	logger.log(2, "\x1b[1m%s\x1b[0m", "Restored save.")

	return "\x1b[1m\x1b[32mSUCCESSFUL\x1b[0m"
}

client.login(process.env["bot-token"])

export const setStatus = (client: Client): Promise<ClientUser> =>
	client.user.setPresence({
		status: "online",
		game: {
			name: version.updateName + " LCN " + version.version,
			type: "PLAYING",
		},
	})
