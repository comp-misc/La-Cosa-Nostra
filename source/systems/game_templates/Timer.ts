// mediate the day/night cycles, set intervals

// this class is NOT meant to be serialised

import crypto from "crypto"
import vocab from "../../auxils/vocab"
import getLogger from "../../getLogger"
import auxils from "../auxils"
import Game from "./Game"
import Logger from "./Logger"
import saveGame from "./saveGame"

const formatDate = (epoch: number): string => {
	// Format into d, h, m
	const days = epoch / (24 * 60 * 60 * 1000)
	const hours = epoch / (60 * 60 * 1000)
	const minutes = epoch / (60 * 1000)

	if (days >= 1) {
		const ret = Math.floor(days)
		return `${ret} day${vocab("s", ret)}`
	} else if (hours >= 1) {
		const ret = Math.floor(hours)
		return `${ret} hour${vocab("s", ret)}`
	} else {
		// Deliberate
		const ret = Math.ceil(minutes)
		return `${ret} minute${vocab("s", ret)}`
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
	private tentativeSaveTimeout: NodeJS.Timeout | undefined

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
		this.day_night_mediator = setTimeout(() => {
			this.step().catch((e) => this.logger.logError(e))
		}, delta)

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
			await saveGame(this.game)
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
			time = config.ticks.time
		}

		this.tick_time = time
		this.tick_interval = setInterval(() => {
			this.tick().catch((e) => this.logger.logError(e))
		}, time)
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
		if (this.tentativeSaveTimeout) {
			clearTimeout(this.tentativeSaveTimeout)
			delete this.tentativeSaveTimeout
		}

		this.tentativeSaveTimeout = setTimeout(() => {
			if (!silent) {
				this.logger.log(1, "Tentative save executed.")
			}
			saveGame(this.game, saveFolder).catch((e) => this.logger.logError(e))
		}, buffer_time)
	}
}

export default Timer
