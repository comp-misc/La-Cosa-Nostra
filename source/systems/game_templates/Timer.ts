// mediate the day/night cycles, set intervals

// this class is NOT meant to be serialised

import crypto from "crypto"
import fs from "fs"

import Game from "./Game"
import Player from "./Player"
import Actions from "./Actions"

import auxils from "../auxils"
import hash from "../../auxils/hash"
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

const decode = (string: string): Record<string, any> => {
	const enc_test = /^encoded_base64\n/gm

	if (enc_test.test(string)) {
		// Encoded in base64
		string = string.replace(enc_test, "")
		string = auxils.btoa(string)
	}
	return JSON.parse(string, jsonReviver)
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

	init(): this {
		this.ticks = 0

		this.prime()

		this.createTick()

		this.updatePresence()
		return this
	}

	reinstantiate(game: Game): this {
		this.game = game
		game.timer = this
		this.game.timer_identifier = this.identifier

		this.ticks = 0

		// Reprime
		this.prime()
		this.createTick()

		this.updatePresence()

		return this
	}

	prime(): void {
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
			this.game.postDelayNotice()

			delta = (this.game.next_action as Date).getTime() - current.getTime()
		}

		this.logger.log(1, `Primer: set D/N mediator delta to: ${delta}`)

		this.designated = designated
		this.primed = current

		this.clearDayNightMediator()
		this.day_night_mediator = setTimeout(this.step, delta)

		// IMPORTANT: Substitute time for delta
		this.updatePresence()
	}

	async step(): Promise<void> {
		this.logger.log(2, "Game step activated.")
		const next_action = await this.game.step()

		// TEMP: set to not fire next step for obvious reasons

		if (next_action === null) {
			// Game ended
			this.clearDayNightMediator()
			this.updatePresence()
		} else {
			this.prime()
		}
	}

	async fastforward(): Promise<void> {
		this.logger.log(2, "Fastforwarded.")
		const next_action = await this.game.step(true)

		if (next_action === null) {
			// Game ended
			this.clearDayNightMediator()
		} else {
			this.prime()
		}
	}

	tick(): void {
		const config = this.game.config

		this.ticks++

		// Autosave

		if (this.ticks % config["ticks"]["autosave-ticks"] === 0) {
			this.save()
		}

		if (this.game.state === "pre-game" || this.game.state === "playing") {
			// Tick to update small things
			this.checkPresenceUpdate()
		}
	}

	checkPresenceUpdate(): void {
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
			this.updatePresence()
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
		this.tick_interval = setInterval(this.tick, time)
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

	tentativeSave(silent = false, buffer_time = 500): void {
		// Save the game after requests stop coming in
		if (this._tentativeSaveTimeout) {
			clearTimeout(this._tentativeSaveTimeout)
			delete this._tentativeSaveTimeout
		}

		this._tentativeSaveTimeout = setTimeout(() => {
			if (!silent) {
				this.logger.log(1, "Tentative save executed.")
			}
			this.save(true)
		}, buffer_time)
	}

	save(silent = false): void {
		const encode = (string: string): string => {
			if (config["encode-cache"]) {
				string = "encoded_base64\n" + auxils.atob(string)
			}
			return string
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
		const config = savable.config

		// Remove non-serialisable components
		delete savable.client
		delete savable.config
		delete savable.timer

		delete savable.actions.game

		delete savable.players

		savable.last_save_date = new Date()

		// Checksum
		const checksum = hash(
			hash(JSON.stringify(savable, jsonInfinityCensor), "md5") +
				hash(savable.last_save_date.getTime().toString(), "md5"),
			"md5"
		)

		savable.checksum = checksum

		// Save object
		fs.writeFileSync(data_directory + "/game_cache/game.save", encode(JSON.stringify(savable, jsonInfinityCensor)))

		// All of players class should be serialisable without deletions
		for (let i = 0; i < players.length; i++) {
			const id = players[i].identifier

			// Duplication regardless
			// For future use if required
			const player = Object.assign({}, players[i])

			// Guess what, I needed it after all
			delete player.game
			delete player.role

			player.last_save_date = new Date()

			// Checksum
			const checksum = hash(
				hash(JSON.stringify(player, jsonInfinityCensor), "md5") +
					hash(player.last_save_date.getTime().toString(), "md5"),
				"md5"
			)

			player.checksum = checksum

			const string = JSON.stringify(player, jsonInfinityCensor)

			// Saved by Discord ID
			fs.writeFileSync(data_directory + "/game_cache/players/" + id + ".save", encode(string))
		}

		if (!silent) {
			this.logger.log(1, "Saved game.")
		}
	}

	static load(client: Client, config: LcnConfig): Timer {
		return loadGame(client, config)
	}
}

const loadGame = (client: Client, config: LcnConfig): Timer => {
	// Loads
	const save = decode(fs.readFileSync(data_directory + "/game_cache/game.save", "utf8"))
	const checksum = save.checksum

	delete save.checksum

	if (
		checksum !==
		hash(
			hash(JSON.stringify(save, jsonInfinityCensor), "md5") +
				hash(new Date(save.last_save_date).getTime().toString(), "md5")
		)
	) {
		getLogger().log(4, "Main save has been tampered with. Caching incident.")

		if (!save.tampered_load_times) {
			save.tampered_load_times = []
		}

		save.tampered_load_times.push(new Date())
	}

	// Save is a game instance
	let game = new Game(client, config, [])
	game = Object.assign(game, save)

	// Reload all players
	const player_saves = fs.readdirSync(data_directory + "/game_cache/players/")
	const players = []

	for (let i = 0; i < player_saves.length; i++) {
		// Check for save
		if (!player_saves[i].endsWith(".save")) {
			continue
		}

		// Reload the save
		const string = fs.readFileSync(data_directory + "/game_cache/players/" + player_saves[i], "utf8")
		const player_save = decode(string)

		const checksum = player_save.checksum
		delete player_save.checksum

		if (
			checksum !==
			hash(
				hash(JSON.stringify(player_save, jsonInfinityCensor), "md5") +
					hash(new Date(player_save.last_save_date).getTime().toString(), "md5")
			)
		) {
			game.logger.log(4, "Save for %s has been tampered with. Caching incident.", player_saves[i])

			if (!player_save.tampered_load_times) {
				player_save.tampered_load_times = []
			}

			player_save.tampered_load_times.push(new Date())
		}

		let player = new Player()

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
	game.reinstantiate(timer, players)
	timer.reinstantiate(game)
	return timer
}

export = Timer
