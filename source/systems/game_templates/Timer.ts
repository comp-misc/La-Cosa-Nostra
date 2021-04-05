// mediate the day/night cycles, set intervals

// this class is NOT meant to be serialised

import crypto from "crypto"
import fs from "fs"

import Game from "./Game"
import Player from "./Player"
import Actions from "./Actions"

import auxils from "../auxils"
import jsonInfinityCensor from "../../auxils/jsonInfinityCensor"
import botDirectories from "../../BotDirectories"
import vocab from "../../auxils/vocab"
import jsonReviver from "../../auxils/jsonReviver"
import Logger from "./Logger"
import { Client } from "discord.js"
import { LcnConfig } from "../../LcnConfig"
import getLogger from "../../getLogger"

const data_directory = botDirectories.data

const charCounter = (string: string): number => {
	let sum = 0
	for (let i = 0; i < string.length; i++) {
		// Multiply by big prime number
		// to reduce chances of collision
		sum += string.charCodeAt(i) * 1300921
	}
	return sum
}

const formatDate = (epoch: number): string => {
	// Format into d, h, m
	const days = epoch / (24 * 60 * 60 * 1000)
	const hours = epoch / (60 * 60 * 1000)
	const minutes = epoch / (60 * 1000)

	if (days >= 1) {
		const ret = Math.floor(days)
		return ret + " day" + vocab("s", ret)
	} else if (hours >= 1) {
		const ret = Math.floor(hours)
		return ret + " hour" + vocab("s", ret)
	} else {
		// Deliberate
		const ret = Math.ceil(minutes)
		return ret + " minute" + vocab("s", ret)
	}
}

class Timer {
	ticks: number
	game: Game
	day_night_mediator: NodeJS.Timeout | null
	readonly identifier: string
	readonly logger: Logger
	designated?: Date
	primed?: Date
	tick_time?: number
	tick_interval: NodeJS.Timeout | undefined
	_tentativeSaveTimeout: NodeJS.Timeout | undefined

	constructor(game: Game) {
		this.day_night_mediator = null

		// Set identifier of timer system for verification
		this.identifier = crypto.randomBytes(16).toString("hex")
		this.logger = getLogger()

		this.game = game
		this.game.timer = this
		this.game.timer_identifier = this.identifier
		this.ticks = 0
	}

	async init(): Promise<this> {
		this.ticks = 0

		await this.prime()

		this.createTick()

		await this.updatePresence()
		return this
	}

	async reinstantiate(game: Game): Promise<this> {
		this.game = game
		game.timer = this
		this.game.timer_identifier = this.identifier

		this.ticks = 0

		// Reprime
		await this.prime()
		this.createTick()

		await this.updatePresence()

		return this
	}

	async prime(): Promise<void> {
		const current = new Date()
		const designated = this.game.next_action

		if (this.game.state === "ended") {
			this.logger.log(2, "Did not prime as game has ended.")
			return
		}
		if (!designated) {
			this.logger.logError(new Error("No next action found"))
			return
		}

		let delta = designated.getTime() - current.getTime()

		if (delta < 0) {
			// Recalculate
			this.game.primeDesignatedTime(true)

			// Alert players
			await this.game.postDelayNotice()

			delta = (this.game.next_action as Date).getTime() - current.getTime()
		}

		this.logger.log(1, `Primer: set D/N mediator delta to: ${delta}`)

		this.designated = designated
		this.primed = current

		this.clearDayNightMediator()
		this.day_night_mediator = setTimeout(this.step, delta)

		// IMPORTANT: Substitute time for delta
		await this.updatePresence()
	}

	async step(): Promise<void> {
		this.logger.log(2, "Game step activated.")
		const next_action = await this.game.step()

		// TEMP: set to not fire next step for obvious reasons

		if (next_action === null) {
			// Game ended
			this.clearDayNightMediator()
			await this.updatePresence()
		} else {
			await this.prime()
		}
	}

	async fastforward(): Promise<void> {
		this.logger.log(2, "Fastforwarded.")
		const next_action = await this.game.step(true)

		if (next_action === null) {
			// Game ended
			this.clearDayNightMediator()
		} else {
			await this.prime()
		}
	}

	async tick(): Promise<void> {
		const config = this.game.config

		this.ticks++

		// Autosave

		if (this.ticks % config.ticks["autosave-ticks"] === 0) {
			this.save()
		}

		if (this.game.state === "pre-game" || this.game.state === "playing") {
			// Tick to update small things
			await this.checkPresenceUpdate()
		}
	}

	async checkPresenceUpdate(): Promise<void> {
		const current = new Date()

		const delta = (this.designated || current).getTime() - current.getTime()
		const tickTime = this.tick_time
		if (!tickTime) {
			return
		}

		const hours = delta / (60 * 60 * 1000)
		let amount: number
		if (hours < 1) {
			amount = Math.ceil((30 * 1000) / tickTime)
		} else {
			amount = Math.ceil((5 * 60 * 1000) / tickTime)
		}

		if (this.ticks % amount === 0) {
			await this.updatePresence()
		}
	}

	async updatePresence(stagger: number | undefined = 800): Promise<void> {
		const current = new Date()

		// In milliseconds
		const delta = (this.designated || current).getTime() - current.getTime()

		if (delta < 0) {
			return
		}

		if (stagger) {
			await auxils.delay(stagger)
		}

		let display: string
		switch (this.game.state) {
			case "pre-game":
				display = "Pre-game: " + formatDate(delta) + " left"
				break
			case "playing":
				display = this.game.getFormattedDay() + ": " + formatDate(delta) + " left"
				break
			default:
				display = this.game.getFormattedDay() + ": game ended"
				break
		}

		await this.game.setPresence({
			status: "online",
			activity: {
				type: "PLAYING",
				name: display,
			},
		})
	}

	createTick(time?: number): void {
		const config = this.game.config

		this.clearTick()

		if (time === undefined) {
			time = config["ticks"]["time"] as number
		}

		this.tick_time = time
		this.tick_interval = setInterval(() => this.tick(), time)
	}

	destroy(): void {
		this.logger.log(3, "Timer instance %s destroyed.", this.identifier)

		this.clearDayNightMediator()
		this.clearTick()
		this.game.clearTrialVoteCollectors()
	}

	clearTick(): void {
		if (this.tick_interval !== undefined) {
			clearInterval(this.tick_interval)
		}
	}

	clearDayNightMediator(): void {
		if (this.day_night_mediator) {
			clearTimeout(this.day_night_mediator)
		}
	}

	tentativeSave(silent = false, buffer_time = 500, saveFolder?: string): void {
		// Save the game after requests stop coming in
		if (this._tentativeSaveTimeout) {
			clearTimeout(this._tentativeSaveTimeout)
			delete this._tentativeSaveTimeout
		}

		this._tentativeSaveTimeout = setTimeout(() => {
			if (!silent) {
				this.logger.log(1, "Tentative save executed.")
			}
			this.save(true, saveFolder)
		}, buffer_time)
	}

	save(silent = false, saveFolder = "game_cache"): void {
		if (!fs.existsSync(data_directory + "/" + saveFolder)) {
			fs.mkdirSync(data_directory + "/" + saveFolder)
		}
		if (!fs.existsSync(data_directory + "/" + saveFolder + "/players")) {
			fs.mkdirSync(data_directory + "/" + saveFolder + "/players")
		}
		// Save all components

		// Clone Game instance to savable
		const savable: Record<string, any> = Object.assign({}, this.game)

		/* This one line of code below here \/ cost me TWO hours of my life
    Honestly if only Object.assign() would clone an object in its whole
    and not do a half-***ed job I would be a happier person.
    */
		savable.actions = Object.assign({}, this.game.actions)

		const players = savable.players

		// Remove non-serialisable components
		delete savable.client
		delete savable.config
		delete savable.timer
		delete savable.logger
		delete savable.trial_collectors

		delete savable.actions.game

		delete savable.players

		savable.last_save_date = new Date()

		// Save object
		fs.writeFileSync(
			data_directory + "/" + saveFolder + "/game.json",
			JSON.stringify(savable, jsonInfinityCensor, 2)
		)

		// All of players class should be serialisable without deletions
		for (let i = 0; i < players.length; i++) {
			const id = players[i].identifier

			// Duplication regardless
			// For future use if required
			const player = Object.assign({}, players[i])

			// Guess what, I needed it after all
			delete player.game
			delete player.role
			delete player.logger
			delete player.client

			player.last_save_date = new Date()

			const string = JSON.stringify(player, jsonInfinityCensor, 2)

			// Saved by Discord ID
			fs.writeFileSync(data_directory + "/" + saveFolder + "/players/" + id + ".json", string)
		}

		if (!silent) {
			this.logger.log(1, "Saved game.")
		}
	}

	static load(client: Client, config: LcnConfig, saveFolder?: string): Promise<Timer> {
		return loadGame(client, config, saveFolder)
	}
}

const loadGame = async (client: Client, config: LcnConfig, saveFolder = "game_cache"): Promise<Timer> => {
	// Loads
	const save = JSON.parse(fs.readFileSync(data_directory + "/" + saveFolder + "/game.json", "utf8"), jsonReviver)

	// Save is a game instance
	let game = new Game(client, config, [])
	game = Object.assign(game, save)

	// Reload all players
	const player_saves = fs.readdirSync(data_directory + "/" + saveFolder + "/players/")
	const players = []

	for (let i = 0; i < player_saves.length; i++) {
		// Check for save
		if (!player_saves[i].endsWith(".json")) {
			continue
		}

		// Reload the save
		const string = fs.readFileSync(data_directory + "/" + saveFolder + "/players/" + player_saves[i], "utf8")
		const player_save = JSON.parse(string, jsonReviver)

		let player = new Player(client)
		player = Object.assign(player, player_save)

		// Reinstantiation of players in Game instance

		players.push(player)
	}

	const actions = new Actions(game)
	game.actions = Object.assign(actions, game.actions)

	// Sort the players array in alphabetical order
	players.sort((a, b) => charCounter(a.alphabet) - charCounter(b.alphabet))

	// Reinstantiate deleted properties
	const timer = new Timer(game)
	await game.reinstantiate(timer, players)
	await timer.reinstantiate(game)
	return timer
}

export = Timer
